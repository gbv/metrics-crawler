console.log("agent twitter");

const mysql = require('mysql');
const request = require('request');

var Twitter = require('twitter');

var base64 = require('base-64');

const sysRunning = require('../modules/sysRunning.js');

var config = require('../config.json');

const consumer_key = process.env.TWITTER_CONSUMER_KEY;
const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;

if(typeof(consumer_key) == "undefined" || typeof(consumer_secret) == "undefined"){
	throw "credentials not defined"
}

var auth_obj = {bearer:null};

var wait_till = null;

var exit_signal = false;

var alt = true;

var durchgang = 0;

// set log levels
var log_level = {info: false, errors: true};

var cooldown = 2001;

var cooldown_get_bearer = 1 * 60 * 60 * 1000;

var running = false;
var running_get_bearer = false;

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});


var client;

function log_error(txt){
	
	if(log_level.errors){
		console.log(txt);
	}
	
}

function log_info(txt){
	
	if(log_level.info){
		console.log(txt);
	}
	
}

function stripURL(url){
	
	if(url !== "" && url !== null){
		if(url.substr(0,8) == "https://"){
			url = url.substr(8);
		}else if(url.substr(0,7) == "http://"){
			url = url.substr(7);
		}

		if(url.substr(0,4) == "www."){
			url = url.substr(4);
		}
	}
	
	return url;
	
}

function get_bearer(callback=function(){}){
	
	log_info("\nGet bearer token.");
	
	if(running_get_bearer){
		return
	}else{
		running_get_bearer = true;
	}
	
	var ck_enc = encodeURIComponent(consumer_key);
	var cs_enc = encodeURIComponent(consumer_secret);
	
	var ck_cs = ck_enc+":"+cs_enc;
	
	var ck_cs_b64 = base64.encode(ck_cs);
	
	var options = {
		method : "POST",
		url: 'https://api.twitter.com/oauth2/token',
		headers: {
			"Authorization": 'Basic '+ck_cs_b64,
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
		},
		form:{
			grant_type: "client_credentials",
		}
	};
	
	
	request(options, function(err, response, body){

		if(err){
			auth_obj.bearer = null;
			log_error(err);
		}else{
			var body = JSON.parse(body);
			if(body.hasOwnProperty('access_token') && body.access_token != null && body.access_token != '' && body.access_token != undefined){
				auth_obj.bearer = body.access_token;	
			}else{
				auth_obj.bearer = null;	
			}
		}
		
		log_info("\nGot bearer token: "+auth_obj.bearer+"\n");
		running_get_bearer = false;
		callback();
		
	});
	
	
	
}


function crawlTwitter(){

	if(running == true){
		return
	}else if(exit_signal){
		process.exit();
		return
 	}else{
		running = true;
	}
	
	sysRunning.check(con, function(shouldRun){
		
		if(shouldRun){
	
			if(wait_till != null && Math.floor(Date.now()/1000) <= wait_till){
				log_info("");
				log_info("waiting for limit reset");
				log_info(wait_till);
				log_info(Math.floor(Date.now()/1000));
				running = false;
				return
			}else if(wait_till != null){
				wait_till = null;
			}
			
			if([0,1,2].includes(durchgang)){
				alt = false;
			}else{
				alt = true;
			}
			
			log_info("======================================================================================================\n");
			log_info("Durchgang: "+durchgang);
			log_info("alt: "+alt);
			
			if(durchgang >= 9){
				durchgang = 0;
			}else{
				durchgang += 1;
			}
			
			if(!alt){
				var sql = "SELECT id, doi, url, first_update_twitter, IFNULL(tries_twitter,0) as tries_twitter, highest_id_twitter FROM works WHERE url_crawled = 1 ORDER BY last_update_twitter ASC LIMIT 1";
			}else{
				var sql = "SELECT id, term_1, term_2, term_3, first_update_twitter, IFNULL(tries_twitter,0) as tries_twitter, highest_id_twitter FROM works_alt ORDER BY last_update_twitter ASC LIMIT 1";
			}

			con.query(sql, function(err, results, fields){

				if(err){
					log_error(err);
					running = false;
				}else{
					
					var id = results[0].id;
					
					if(!alt){
						var doi = results[0].doi;
						var url = stripURL(results[0].url);
					}

					var tries_twitter = parseInt(results[0].tries_twitter);
					var first_update_twitter = results[0].first_update_twitter;

					var highest_id = results[0].highest_id_twitter || 0;
					
					var query = "";
					
					log_info("work id: "+id);

					if(!alt){
						
						if(url == "" || url === null){
							query = doi;
						}else{
							query = '"'+url+'"OR"'+doi+'"';
						}
						
					}else{
						
						var term_1 = stripURL(results[0].term_1);
						var term_2 = stripURL(results[0].term_2);
						var term_3 = stripURL(results[0].term_3);
						
						if(!term_1){
							throw 'term_1 must be a not-empty string';
						}
						
						if(term_2){
							
							if(term_3){
								
								query = '"'+term_1+'"OR"'+term_2+'"OR"'+term_3+'"';
								
							}else{
								
								query = '"'+term_1+'"OR"'+term_2+'"';
								
							}
							
						}else{
							query = term_1;
						}
						
					}
					
					if(query.length > 450){
						log_info("Query too long: "+query);
						
						let theTime = new Date();
						
						if(!alt){
							sql = "UPDATE works SET last_update_twitter = ? WHERE id = ?";
						}else{
							sql = "UPDATE works_alt SET last_update_twitter = ? WHERE id = ?";
						}
						
						var values = [theTime, id];

						con.query(sql, values, function(err, results, fields){

							if(err){
								log_error(err);
							}

							running = false;

						});
						
						return
							
					}
					log_info("query: "+query);
					log_info("query length: "+query.length);

					client.get('search/tweets', {q: query, result_type: "recent", count: 100, since_id: highest_id, include_entities: true, tweet_mode: 'extended'}, function(err, tweets, response){

						var x_rate_limit_remaining = response.headers['x-rate-limit-remaining'];

						if(x_rate_limit_remaining == "0"){
							wait_till = parseInt(response.headers['x-rate-limit-reset']);
						}

						log_info("Remaining calls: "+x_rate_limit_remaining);

						if(err && err instanceof Array && err[0].hasOwnProperty('code')){

							log_error(err);
							
							var errCode = err[0].code;

							// handle rate limit error
							if(errCode == 88 || errCode == "88"){
								running = false;
								return
							}
							
							if(!alt){
								var sql = "SELECT last_update_twitter FROM works WHERE url_crawled = 1 ORDER BY last_update_twitter ASC LIMIT 1 OFFSET 100;";
							}else{	
								var sql = "SELECT last_update_twitter FROM works_alt ORDER BY last_update_twitter ASC LIMIT 1 OFFSET 100;";
							}

							con.query(sql, null, function(err, results, fields){

								if(err){
									log_error(err);
								}else{
									var new_lu = results[0].last_update_twitter;

									if(tries_twitter > 4){

										var theTime = new Date();

										if(!alt){
											sql = "UPDATE works SET last_update_twitter = ?, tries_twitter = 0, state_twitter = ? WHERE id = ?";
										}else{
											sql = "UPDATE works_alt SET last_update_twitter = ?, tries_twitter = 0, state_twitter = ? WHERE id = ?";
										}
										
										var values = [theTime, 'TwitterErr: '+errCode, id];

										con.query(sql, values, function(err, results, fields){

											if(err){
												log_error(err);
											}

											running = false;

										});

									}else{

										var tries_new = tries_twitter + 1;

										if(!alt){
											sql = "UPDATE works SET last_update_twitter = ?, tries_twitter = ?, state_twitter = ? WHERE id = ?";
										}else{
											sql = "UPDATE works_alt SET last_update_twitter = ?, tries_twitter = ?, state_twitter = ? WHERE id = ?";
										}
										var values = [new_lu, tries_new, 'TwitterErr: '+errCode, id];

										con.query(sql, values, function(err, results, fields){

											if(err){
												log_error(err);
											}

											running = false;

										});

									}

								}

							});

							return

						}else if(err){

							log_error(err);
							
							if(!alt){
								var sql = "SELECT last_update_twitter FROM works WHERE url_crawled = 1 ORDER BY last_update_twitter ASC LIMIT 1 OFFSET 100;";
							}else{
								var sql = "SELECT last_update_twitter FROM works_alt ORDER BY last_update_twitter ASC LIMIT 1 OFFSET 100;";
							}

							con.query(sql, null, function(err, results, fields){

								if(err){
									log_error(err);
								}else{
									var new_lu = results[0].last_update_twitter;

									if(tries_twitter > 4){

										var theTime = new Date();

										if(!alt){
											sql = "UPDATE works SET last_update_twitter = ?, tries_twitter = 0, state_twitter = ? WHERE id = ?";
										}else{
											sql = "UPDATE works_alt SET last_update_twitter = ?, tries_twitter = 0, state_twitter = ? WHERE id = ?";
										}
										
										var values = [theTime, 'TwitterErr: unknown', id];

										con.query(sql, values, function(err, results, fields){

											if(err){
												log_error(err);
											}

											running = false;

										});

									}else{

										var tries_new = tries_twitter + 1;

										if(!alt){
											sql = "UPDATE works SET last_update_twitter = ?, tries_twitter = ?, state_twitter = ? WHERE id = ?";
										}else{
											sql = "UPDATE works_alt SET last_update_twitter = ?, tries_twitter = ?, state_twitter = ? WHERE id = ?";
										}
										
										var values = [new_lu, tries_new, 'TwitterErr: unknown', id];

										con.query(sql, values, function(err, results, fields){

											if(err){
												log_error(err);
											}

											running = false;

										});

									}

								}

							});

							return

						}
						
						var unique_count = 0;
						var retweet_count = 0;

						log_info("");

						if(tweets.statuses.length == 0){
							log_info("no tweets found.");
						}else{
							log_info("statuses:");
							log_info(tweets.statuses);

							for(var i = 0; i < tweets.statuses.length; i++){

								var theTweet = tweets.statuses[i];

								if(theTweet.hasOwnProperty('retweeted_status')){
									retweet_count += 1;
								}else{
									unique_count += 1;
								}

							}

							log_info("\nunique: "+unique_count);
							log_info("retweet: "+retweet_count);

							if(unique_count + retweet_count !== tweets.statuses.length){
								// error log
								log_error("uniques + retweets != tweets.statuses.length");
							}

						}

						log_info("");


						if(tweets.search_metadata.max_id_str){

							var theTime = new Date();

							if(tweets.statuses.length > 0){

								var insert_data = [];

								for (var i = 0; i < tweets.statuses.length; i++){

									var theStatus = tweets.statuses[i];

									if(theStatus.hasOwnProperty('retweeted_status')){

										var rt_status = 1;

									}else{

										var rt_status = 0;

									}

									insert_data.push([id, theStatus.id_str, JSON.stringify(theStatus), query, rt_status, url, new Date(theStatus.created_at)]);

								}

								if(!alt){
									var sql_ddump = "INSERT INTO data_dumps_twitter (work_id, obj_id, data, search_term, type, search_url, occurred) VALUES ?";
								}else{
									var sql_ddump = "INSERT INTO data_dumps_twitter_alt (work_alt_id, obj_id, data, search_term, type, search_url, occurred) VALUES ?";
								}
								con.query(sql_ddump, [insert_data], function(err, results, fields){

									if(err){
										log_error("MYSQL-ERROR:\n"+err+"\n");
									}else{

										log_info("data dump inserted");

									}


								});

								var sum = tweets.statuses.length;

								if(first_update_twitter == null){

									var options = [unique_count, retweet_count, theTime, theTime, tweets.search_metadata.max_id_str, id];
									
									if(!alt){
										sql = "UPDATE works SET state_twitter = NULL, count_twitter_unique = count_twitter_unique + ?, count_twitter_retweets = count_twitter_retweets + ?, last_update_twitter = ?, tries_twitter = 0, first_update_twitter = ?, highest_id_twitter = ? WHERE id = ?";
									}else{
										sql = "UPDATE works_alt SET state_twitter = NULL, count_twitter_unique = count_twitter_unique + ?, count_twitter_retweets = count_twitter_retweets + ?, last_update_twitter = ?, tries_twitter = 0, first_update_twitter = ?, highest_id_twitter = ? WHERE id = ?";
									}
									
								}else{

									var options = [unique_count, retweet_count, theTime, tweets.search_metadata.max_id_str, id];
									
									if(!alt){
										sql = "UPDATE works SET state_twitter = NULL, count_twitter_unique = count_twitter_unique + ?, count_twitter_retweets = count_twitter_retweets + ?, last_update_twitter = ?, tries_twitter = 0, highest_id_twitter = ? WHERE id = ?";
									}else{
										sql = "UPDATE works_alt SET state_twitter = NULL, count_twitter_unique = count_twitter_unique + ?, count_twitter_retweets = count_twitter_retweets + ?, last_update_twitter = ?, tries_twitter = 0, highest_id_twitter = ? WHERE id = ?";
									}
								}

							}else{

								if(first_update_twitter == null){

									var options = [theTime, theTime, tweets.search_metadata.max_id_str, id];
									
									if(!alt){
										sql = "UPDATE works SET state_twitter = NULL, last_update_twitter = ?, tries_twitter = 0, first_update_twitter = ?, highest_id_twitter = ? WHERE id = ?";
									}else{
										sql = "UPDATE works_alt SET state_twitter = NULL, last_update_twitter = ?, tries_twitter = 0, first_update_twitter = ?, highest_id_twitter = ? WHERE id = ?";
									}

								}else{

									var options = [theTime, tweets.search_metadata.max_id_str, id];
									
									if(!alt){
										sql = "UPDATE works SET state_twitter = NULL, last_update_twitter = ?, tries_twitter = 0, highest_id_twitter = ? WHERE id = ?";
									}else{
										sql = "UPDATE works_alt SET state_twitter = NULL, last_update_twitter = ?, tries_twitter = 0, highest_id_twitter = ? WHERE id = ?";
									}
									
								}

							}


							con.query(sql, options, function(err, results, fields){

								if(err){
									log_error(err);
								}else{
									if(typeof(sum) != 'undefined' && sum > 0){
										log_info(sum+" added.");
									}

									log_info("works updated.\n");
								}						

								running = false;

							});

						}else{
							running = false;
						}

					});

				}

			});
		
		}else{
			log_info("I should not run.");
			running = false;
		}
			
	});

}

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    exit_signal = true;
});

con.connect(function(err){

	if(err){
		log_error("MYSQL ERROR:\n"+err)
	}else{
		log_info("\nConnected to MYSQL database.");
		get_bearer(function(){
			
			client = new Twitter({

				consumer_key: consumer_key,
				consumer_secret: consumer_secret,
				bearer_token: auth_obj.bearer

			});
			
			crawlTwitter();
			setInterval(crawlTwitter, cooldown);
			setInterval(get_bearer, cooldown_get_bearer);
			
		});
		
	}

});


