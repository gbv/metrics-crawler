console.log("agent facebook");

var FB = require('fb');
const mysql = require('mysql');

const sysRunning = require('../modules/sysRunning.js');

var config = require('../config.json');

var md5 = require('md5');

var client_id = process.env.FACEBOOK_CLIENT_ID;
var client_secret = process.env.FACEBOOK_CLIENT_SECRET;

if(typeof(client_id) == "undefined" || typeof(client_secret) == "undefined"){
	throw "credentials not defined"
}

var cooldown = 17500;
var latest_call_counts = [];

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

function startCycle(){
	
	if(running){
		log_info("running thus no new cycle.");
        setTimeout(startCycle, cooldown/4);
		return
	}else{
		running = true;
	}
	
	sysRunning.check(con, function(shouldRun){
		
		if(shouldRun){

			var sql = "SELECT id, url, urls FROM works WHERE url_crawled = 1 ORDER BY last_update_facebook ASC LIMIT 1";

			con.query(sql, function(err, results, fields){

				if(err){
					// set last_update
					log_error(err);
					running = false;
                    setTimeout(startCycle, cooldown/4);
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
						crawlFacebook(work_id, url, works_urls);
					}

				}

			});
			
		}else{
			log_info("I should not run.");
			running = false;
		}
		
	});

}

function crawlFacebook(work_id, url, urls){
	
	if(url.substr(0,6) == "https:"){

		var url_http = "http:"+url.substr(6);
		var url_https = url;
		var url_no_prot = url.substr(8);
		
	}else{

		var url_http = url;
		var url_https = "https:"+url.substr(5);
		var url_no_prot = url.substr(7);
					
	}
	
	FB.api(encodeURIComponent(url_http), { fields: ['engagement'], access_token: client_id+"|"+client_secret }, function (res) {
        
        try{

            console.log("CD: "+cooldown);
            console.log(latest_call_counts);

            if(latest_call_counts.length > 15 && res.usage.call_count != 0){
                
                var current_call_count = res.usage.call_count;
                
                if(current_call_count > 94){
                    if(current_call_count > 100){
                        cooldown += 250;
                        console.log("cooldown + 250");
                    }else{
                        cooldown += 25;
                        console.log("cooldown + 25");
                    }
                }else if(current_call_count <= 90){
                    
                    let min = Math.min(...latest_call_counts);
                    let diff = latest_call_counts[0] - min;
                    console.log("diff: "+diff);
                    
                    if(cooldown > 13000 && diff < 1){
                        if(res.usage.call_count >= 80){
                            console.log("cooldown - 20");
                            cooldown -= 20;
                        }else{
                            cooldown -= 75;
                            console.log("cooldown - 75");
                        }
                    }
                }
            }

            if(!isNaN(parseInt(res.usage.call_count))){
                latest_call_counts.unshift(res.usage.call_count);
            }

            while(latest_call_counts.length > 20){
                latest_call_counts.pop();
            }

        }catch(e){
            log_error(e);
        }

		if(!res || res.error || !res.hasOwnProperty('engagement') || !res.engagement.hasOwnProperty('reaction_count') || !res.engagement.hasOwnProperty('comment_count') || !res.engagement.hasOwnProperty('share_count') || !res.engagement.hasOwnProperty('comment_plugin_count')) {
			
			log_error(!res ? 'error occurred' : res.error);
			only_update_lu(work_id);
			return
			
		}else{
			log_info("");
			log_info(res);
            
			var reaction_count = res.engagement.reaction_count;
			var comment_count = res.engagement.comment_count;
			var share_count = res.engagement.share_count;
			var comment_plugin_count = res.engagement.comment_plugin_count;
			
			setTimeout(function(){
				
				FB.api(encodeURIComponent(url_https), { fields: ['engagement'], access_token: client_id+"|"+client_secret }, function (res1) {

					if(!res1 || res1.error || !res1.hasOwnProperty('engagement') || !res1.engagement.hasOwnProperty('reaction_count') || !res1.engagement.hasOwnProperty('comment_count') || !res1.engagement.hasOwnProperty('share_count') || !res1.engagement.hasOwnProperty('comment_plugin_count')) {

						log_error(!res1 ? 'error occurred' : res1.error);
						only_update_lu(work_id);
						return

					}else{
						
						log_info("");
						log_info(res1);

						reaction_count += res1.engagement.reaction_count;
						comment_count += res1.engagement.comment_count;
						share_count += res1.engagement.share_count;
						comment_plugin_count += res1.engagement.comment_plugin_count;

						var theTime = new Date();
						
						if(urls == 0){
							
							var sql = "UPDATE works SET reaction_count_facebook = ?, comment_count_facebook = ?, share_count_facebook = ?, comment_plugin_count_facebook = ?, last_update_facebook = ? WHERE id = ? and urls = 0";

							con.query(sql, [reaction_count, comment_count, share_count, comment_plugin_count, theTime, work_id], function(err, results, fields){

								if(err){
									log_error(err);
								}else{
									log_info("\nworks updated.");
								}

								running = false;

							});
							
						}else{
							
							var url_md5_ss16 = md5(url_no_prot).substr(0,16);

							var sql = "SELECT urls.id, urls.reaction_count_facebook as urls_reaction_count_facebook, works.reaction_count_facebook as works_reaction_count_facebook, urls.comment_count_facebook as urls_comment_count_facebook, works.comment_count_facebook as works_comment_count_facebook, urls.share_count_facebook as urls_share_count_facebook, works.share_count_facebook as works_share_count_facebook, urls.comment_plugin_count_facebook as urls_comment_plugin_count_facebook, works.comment_plugin_count_facebook as works_comment_plugin_count_facebook FROM urls LEFT JOIN works ON urls.work_id = works.id WHERE urls.work_id = ? AND urls.hash = ? AND urls.url = ?";

							con.query(sql, [work_id, url_md5_ss16, url_no_prot], function(err, results, fields){

								if(err){
									log_error(err);
									only_update_lu(work_id);
								}else{

									if(results && (reaction_count != null && comment_count != null && share_count != null && comment_plugin_count != null)){

										var urls_id = results[0].id;
										
										var works_reaction_count_facebook = results[0].works_reaction_count_facebook;
										var urls_reaction_count_facebook = results[0].urls_reaction_count_facebook;
										
										var works_comment_count_facebook = results[0].works_comment_count_facebook;
										var urls_comment_count_facebook = results[0].urls_comment_count_facebook;
										
										var works_share_count_facebook = results[0].works_share_count_facebook;
										var urls_share_count_facebook = results[0].urls_share_count_facebook;
										
										var works_comment_plugin_count_facebook = results[0].works_comment_plugin_count_facebook;
										var urls_comment_plugin_count_facebook = results[0].urls_comment_plugin_count_facebook;

										if(works_reaction_count_facebook == null){
											works_reaction_count_facebook = 0;
										}

										if(urls_reaction_count_facebook == null){
											urls_reaction_count_facebook = 0;
										}
										
										if(works_comment_count_facebook == null){
											works_comment_count_facebook = 0;
										}

										if(urls_comment_count_facebook == null){
											urls_comment_count_facebook = 0;
										}
										
										if(works_share_count_facebook == null){
											works_share_count_facebook = 0;
										}

										if(urls_share_count_facebook == null){
											urls_share_count_facebook = 0;
										}
										
										if(works_comment_plugin_count_facebook == null){
											works_comment_plugin_count_facebook = 0;
										}

										if(urls_comment_plugin_count_facebook == null){
											urls_comment_plugin_count_facebook = 0;
										}
										
										var diff_rc = reaction_count - urls_reaction_count_facebook;
										var diff_cc = comment_count - urls_comment_count_facebook;
										var diff_sc = share_count - urls_share_count_facebook;
										var diff_cpc = comment_plugin_count - urls_comment_plugin_count_facebook;

										con.query("UPDATE urls SET reaction_count_facebook = ?, comment_count_facebook = ?, share_count_facebook = ?, comment_plugin_count_facebook = ? WHERE id = ?", [reaction_count, comment_count, share_count, comment_plugin_count, urls_id], function(err, results, fields){

											if(err){
												log_error(err);
												only_update_lu(work_id);
											}else{
												
												log_info("\nurls table updated.");

												con.query("UPDATE works SET reaction_count_facebook = IFNULL(reaction_count_facebook, 0) + ?, comment_count_facebook = IFNULL(comment_count_facebook, 0) + ?, share_count_facebook = IFNULL(share_count_facebook, 0) + ?, comment_plugin_count_facebook = IFNULL(comment_plugin_count_facebook, 0) + ?, last_update_facebook = ? WHERE id = ?", [diff_rc, diff_cc, diff_sc, diff_cpc, theTime, work_id], function(err, results, fields){

													if(err){

														log_error(err);
														only_update_lu(work_id);	

													}else{
										
														log_info("works updated.");
														running = false;

													}

												});

											}

										});

									}											

								}

							});
							
						}

					}

                    setTimeout(startCycle, cooldown);
                    
				});
                
			}, cooldown);
			
		}

	});
	
}

function only_update_lu(work_id){

	var theTime = new Date();

	var sql = "UPDATE works SET last_update_facebook = ? WHERE id = ?";

	con.query(sql, [theTime, work_id], function(err, results, fields){

		if(err){
			log_error(err);
		}else{
			log_info("\nworks updated.");
		}

		running = false;
        setTimeout(startCycle, cooldown);

	});
	
}

con.connect(function(err){

	if(err){
		
		log_error("MYSQL ERROR:\n"+err);
		
	}else{
		
		log_info("\nConnected to MYSQL database.");
		startCycle();
		
	}

});

