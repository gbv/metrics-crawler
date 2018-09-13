console.log("agent youtube");

const mysql = require('mysql');
const request = require('request');

var md5 = require('md5');

const sysRunning = require('../modules/sysRunning.js');

var config = require('../config.json');

const youtube_api_key = process.env.YOUTUBE_API_KEY;

if(typeof(youtube_api_key) == "undefined"){
	throw "credentials not defined"
}

var cooldown = 9000;

var running = false;
var running_dumps = false;

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

function startCycle(){
	
	if(running || running_dumps){
		log_info("running thus no new cycle.");
		return
	}else{
		running = true;
	}
	
	sysRunning.check(con, function(shouldRun){
		
		if(shouldRun){

			var sql = "SELECT id, url, urls FROM works WHERE url_crawled = 1 ORDER BY last_update_youtube ASC LIMIT 1";

			con.query(sql, function(err, results, fields){

				if(err){
					// set last_update
					log_error(err);
					running = false;
					return
				}else{

					var work_id = results[0].id;
					var url = results[0].url;

					var works_urls = results[0].urls;

					log_info("");
					log_info("==========================================================================================================\n");
					log_info("work_id: "+work_id);
					log_info("url: "+url);

					if(!url || url == null || url == "" || typeof(url) == "undefined"){
						only_update_lu(work_id);
					}else{
						crawl_youtube(work_id, url, works_urls);
					}

				}

			});
			
		}else{
			log_info("I should not run.");
			running = false;
		}
		
	});

}

function crawl_youtube(work_id, url, urls){
	
	if(url.substr(0,6) == "https:"){

		var url_no_prot = url.substr(8);
		
	}else{

		var url_no_prot = url.substr(7);
					
	}
	
	// not searching for doi because of tracking of changed urls and their results
	var q = url_no_prot;
	
	log_info("q: "+q);
	
	var q_esc = encodeURIComponent(q);
	
	var options = {
	
		// order = date nicht möglich, da sonst keine items gesendet
		url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q='+q_esc+'&key='+youtube_api_key,
      	headers: {
			
			"User-Agent": "node.js:metrics_bot:v0.1"
			
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
				
				if(!parsed.hasOwnProperty('pageInfo') || !parsed.pageInfo.hasOwnProperty('totalResults')){
					
					log_error("ERROR\n"+body);
					running = false;
					return;
					
				}else{
					
					var theTime = new Date();
					
					var count_youtube = parsed.pageInfo.totalResults;

					log_info("\ncount_youtube: "+count_youtube);
					
					if(count_youtube != null){
						
						if(count_youtube > 0){
							
							running_dumps = true;
							log_info("\nsaving dumps started");
							
							if(parsed.hasOwnProperty('nextPageToken')){
								
								var saveArr = [];

								var npt = parsed.nextPageToken;
								
								loopPages(parsed, saveDump);
								
							}else{
								
								saveDump(JSON.stringify([parsed]));
								
							}
							
							function loopPages(saveObj, callback){
								
								if(saveObj.hasOwnProperty('items') && saveObj.items.hasOwnProperty('length') && saveObj.items.length > 0){
									saveArr.push(saveObj);
								}else{
									callback(JSON.stringify(saveArr));
									return
								}
								
								if(saveObj.hasOwnProperty('nextPageToken')){
									
									var npt = saveObj.nextPageToken;
									
									let options = {
	
										// order = date nicht möglich, da sonst keine items gesendet
										url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q='+q_esc+'&pageToken='+npt+'&key='+youtube_api_key,
										headers: {

											"User-Agent": "node.js:metrics_bot:v0.1"
			
										}
										
									}
									
									setTimeout(function(){
										
										request(options,function(err, response, body){

											if(err){
												log_error(err);
												running_dumps = false;
												log_info("saving dumps aborted");
												return
											}

											loopPages(JSON.parse(body), saveDump);

										});
									
									}, cooldown);
									
									
									
									
								}else{
									callback(JSON.stringify(saveArr));
									return
								}
								
							}
							
							function saveDump(saveData){
								
								let url_md5_ss16 = md5(url_no_prot).substr(0,16);

								let sql = "SELECT id FROM data_dumps_youtube WHERE work_id = ? AND hash = ? AND url = ?";

								con.query(sql, [work_id, url_md5_ss16, url_no_prot], function(err, results, fields){

									if(!err){

										if(results.length > 0){

											var dump_id = results[0].id;

											let sql = "UPDATE data_dumps_youtube SET data = ? WHERE id = ?";

											con.query(sql, [saveData, dump_id], function(err, results, fields){

												if(err){
													log_error(err);
												}
												
												running_dumps = false;
												log_info("\nsaving dumps finished");

											});

										}else{

											let sql = "INSERT INTO data_dumps_youtube (work_id, hash, url, data) VALUES (?,?,?,?)";

											con.query(sql, [work_id, url_md5_ss16, url_no_prot, saveData], function(err, results, fields){

												if(err){
													log_error(err);
												}
												
												running_dumps = false;
												log_info("\nsaving dumps finished");

											});

										}

									}else{
										running_dumps = false;
									}

								});

							}
							
						}

						if(urls == 0){

							var sql = "UPDATE works SET count_youtube = ?, last_update_youtube = ? WHERE id = ? AND urls = 0";

							con.query(sql, [count_youtube, theTime, work_id], function(err, results, fields){

								if(err){
									log_error(err);
								}else{
									log_info("\nworks updated.");
								}

								running = false;

							});

						}else{

							var url_md5_ss16 = md5(url_no_prot).substr(0,16);

							var sql = "SELECT urls.id, urls.count_youtube as urls_count_youtube, works.count_youtube as works_count_youtube FROM urls LEFT JOIN works ON urls.work_id = works.id WHERE urls.work_id = ? AND urls.hash = ? AND urls.url = ?";

							con.query(sql, [work_id, url_md5_ss16, url_no_prot], function(err, results, fields){

								if(err){
									log_error(err);
									only_update_lu(work_id);
								}else{

									if(results && count_youtube != null){

										var urls_id = results[0].id;
										var works_count_youtube = results[0].works_count_youtube;
										var urls_count_youtube = results[0].urls_count_youtube;

										if(urls_count_youtube == null){
											urls_count_youtube = 0;
										}

										if(works_count_youtube == null){
											works_count_youtube = 0;
										}

										var diff = count_youtube - urls_count_youtube;

										con.query("UPDATE urls SET count_youtube = ? WHERE id = ?", [count_youtube, urls_id], function(err, results, fields){

											if(err){
												log_error(err);
												only_update_lu(work_id);
											}else{

												con.query("UPDATE works SET count_youtube = IFNULL(count_youtube, 0) + ?, last_update_youtube = ? WHERE id = ?", [diff, theTime, work_id], function(err, results, fields){

													if(err){

														log_error(err);
														only_update_lu(work_id);	

													}else{
														log_info("works updated");
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

	var sql = "UPDATE works SET last_update_youtube = ? WHERE id = ?";

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
		startCycle();
		
		setInterval(function(){
			
			startCycle();
			
		}, cooldown);
	}

});

