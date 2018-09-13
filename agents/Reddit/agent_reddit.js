console.log("agent reddit");

// LIMITATION: max result count: 100 (if reached --> implement pagination handling)

const mysql = require('mysql');
const request = require('request');

const sysRunning = require('../modules/sysRunning.js');

var config = require('../config.json');

var base64 = require('base-64');

var md5 = require('md5');

const reddit_client_id = process.env.REDDIT_CLIENT_ID;
const reddit_client_secret = process.env.REDDIT_CLIENT_SECRET;

if(typeof(reddit_client_id) == "undefined" || typeof(reddit_client_secret) == "undefined"){
	throw "credentials not defined"
}

const cid_enc = encodeURIComponent(reddit_client_id);
const cs_enc = encodeURIComponent(reddit_client_secret);

const cid_cs = cid_enc+":"+cs_enc;

const auth_b64 = base64.encode(cid_cs);

var cooldown = 1020;

var running = false;

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});

// set log levels
var log_level = {info: false, errors: true};

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

var tokenObj = {};

function updateToken(doNext){
	
	if(running){
		log_info("running thus no new cycle.");
		return;
	}else{
		running = true;
	}
	
	sysRunning.check(con, function(shouldRun){
		
		if(shouldRun){
	
			if(!tokenObj.hasOwnProperty('update_timepoint') || tokenObj.update_timepoint < new Date(Date.now())){

				var options = {
					method : "POST",
					url: 'https://www.reddit.com/api/v1/access_token',
					headers: {
						"Authorization": 'Basic '+auth_b64,
						"Content-Type": 'application/x-www-form-urlencoded'
					},
					form:{
						grant_type: 'client_credentials'
					}
				};

				function callback(err, response, body){

					if(err){
						log_error(err);
						running = false;
						return;
					}else{
						try{
							var bodyObj = JSON.parse(body);

							log_info(bodyObj);

							if(bodyObj.hasOwnProperty('access_token') && bodyObj.hasOwnProperty('expires_in')){

								tokenObj = bodyObj;

								tokenObj.update_timepoint = new Date(Date.now() + (parseInt(tokenObj.expires_in)-300)*1000);

								log_info("");
								log_info("##########################################################################################################");
								log_info("updated token. new update_timepoint: "+tokenObj.update_timepoint);
								log_info("##########################################################################################################");

								doNext();
							}else{
								log_error("OAUTH: UNEXPECTED DATA FORMAT");
								running = false;
								return;
							}

						}catch(err){
							log_error(err);
							running = false;
							return;
						}
					}

				}

				request.post(options, callback);


			}else{
				doNext();
			}
		
		}else{
			log_info("I should not run.");
			running = false;
		}
		
	});
	
}

function startCycle(){
	
	var sql = "SELECT id, url, urls FROM works WHERE url_crawled = 1 ORDER BY last_update_reddit ASC LIMIT 1";

	con.query(sql, function(err, results, fields){

		if(err){
			// set last_update
			log_error(err);
			running = false;
			return;
		}else{

			var work_id = results[0].id;
			var url = results[0].url;
			
			var works_urls = results[0].urls;
			
			log_info("");
			log_info("==========================================================================================================\n");
			log_info("work_id: "+work_id);
			log_info("url: "+url);
			
			if(url == null || url == ""){
				only_update_lu(work_id);
			}else{
				crawl_reddit(work_id, url, works_urls);
			}

		}

	});

}

function crawl_reddit(work_id, url, urls){
	
	if(url.substr(0,6) == "https:"){

		var url_no_prot = url.substr(8);
		
	}else{

		var url_no_prot = url.substr(7);
					
	}
	
	var url_esc = encodeURIComponent(url_no_prot);
	
	log_info(url_no_prot);
	
	var options = {
	
		url: 'https://oauth.reddit.com/search?q=url:'+url_esc+'&t=all&limit=100&sort=new',
      	headers: {
			
			"Authorization": 'Bearer '+ tokenObj.access_token,
			"User-Agent": config.user_agent_headers.reddit
			
		}
		
	};
	
	function callback(err, response, body){
	
		if(err){
			log_error("ERROR\n"+err);
			running = false;
			return;
		}else{
			
			try{

				var parsed = JSON.parse(body);
				
				if(!parsed.hasOwnProperty('kind') || parsed.kind != "Listing"){
					log_error("ERROR\n"+body);
					running = false;
					return;
				}else{
					
					var theTime = new Date();
					
					log_info(JSON.stringify(parsed));
					
					var count_reddit = parsed.data.dist;

					log_info("count_reddit:"+count_reddit);
					
					if(count_reddit != null){
						
						if(count_reddit > 0){
							
							let url_md5_ss16 = md5(url_no_prot).substr(0,16);
							
							let sql = "SELECT id FROM data_dumps_reddit WHERE work_id = ? AND hash = ? AND url = ?";
							
							con.query(sql, [work_id, url_md5_ss16, url_no_prot], function(err, results, fields){
								
								if(!err){
									
									if(results.length > 0){
										
										var dump_id = results[0].id;
										
										let sql = "UPDATE data_dumps_reddit SET data = ? WHERE id = ?";
										
										con.query(sql, [body, dump_id], function(err, results, fields){

											if(err){
												log_error(err);
											}
											
										});
										
									}else{
										
										let sql = "INSERT INTO data_dumps_reddit (work_id, hash, url, data) VALUES (?,?,?,?)";
										
										con.query(sql, [work_id, url_md5_ss16, url_no_prot, body], function(err, results, fields){

											if(err){
												log_error(err);
											}
											
										});
										
									}
									
								}
								
							});
							
						}
						
						if(urls == 0){

							var sql = "UPDATE works SET count_reddit = ?, last_update_reddit = ? WHERE id = ? AND urls = 0";

							con.query(sql, [count_reddit, theTime, work_id], function(err, results, fields){

								if(err){
									log_error(err);
								}else{
									log_info("\nworks updated.");
								}

								running = false;

							});

						}else{
							
							var url_md5_ss16 = md5(url_no_prot).substr(0,16);

							var sql = "SELECT urls.id, urls.count_reddit as urls_count_reddit, works.count_reddit as works_count_reddit FROM urls LEFT JOIN works ON urls.work_id = works.id WHERE urls.work_id = ? AND urls.hash = ? AND urls.url = ?";

							con.query(sql, [work_id, url_md5_ss16, url_no_prot], function(err, results, fields){

								if(err){
									log_error(err);
									only_update_lu(work_id);
								}else{

									if(results && count_reddit != null){

										var urls_id = results[0].id;
										var works_count_reddit = results[0].works_count_reddit;
										var urls_count_reddit = results[0].urls_count_reddit;

										if(urls_count_reddit == null){
											urls_count_reddit = 0;
										}

										if(works_count_reddit == null){
											works_count_reddit = 0;
										}

										var diff = count_reddit - urls_count_reddit;

										con.query("UPDATE urls SET count_reddit = ? WHERE id = ?", [count_reddit, urls_id], function(err, results, fields){

											if(err){
												log_error(err);
												only_update_lu(work_id);
											}else{

												con.query("UPDATE works SET count_reddit = IFNULL(count_reddit, 0) + ?, last_update_reddit = ? WHERE id = ?", [diff, theTime, work_id], function(err, results, fields){

													if(err){

														log_error(err);
														only_update_lu(work_id);	

													}else{

														running = false;

													}

												});

											}

										});

									}											

								}

							});

						}
								
						
					}else{
					
						only_update_lu(work_id);
						
					}
					
				}
				
			}catch(e){
				
				log_error(e);
				running = false;
				
			}

		}
		
	}
	
	
	request(options, callback);
	
	
}

function only_update_lu(work_id){

	var theTime = new Date();

	var sql = "UPDATE works SET last_update_reddit = ? WHERE id = ?";

	con.query(sql, [theTime, work_id], function(err, results, fields){

		if(err){
			log_error(err);
		}else{
			log_info("\nworks updated.");
		}

		running = false;

	});
	
}


con.connect(function(err){

	if(err){
		
		log_error("MYSQL ERROR:\n"+err);
		
	}else{
		
		log_info("\nConnected to MYSQL database.");
		updateToken(startCycle);
		
		setInterval(function(){
			
			updateToken(startCycle);
			
		}, cooldown);
	}

});


