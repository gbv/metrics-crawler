console.log("doi resolver browser");

const mysql = require('mysql');
const request = require('request');
const URL = require('url-parse');
var pdfCheck_url = require('./include/pdfCheck_url.js');

var config = require('../config.json');

var md5 = require('md5');

var driver;

const doi_endpoint = 'https://doi.org/api/handles/';

// set log levels
var log_level = {info: false, errors: true};

// how much time to wait before giving up loading a page [in ms]
var pageLoadTimeout = 120 * 1000;

var running = false;

// set this to false if you want to see the browser window
var headlessMode = true;

// size of the pool from which works are taken randomly (to prevent too much concurrency even though concurrency between the doi resolving bots is accounted for) [80 is nice]
var pool_size_commit = 80;

// set tmp directory
var tmp_path = config.doi_resolver_tmp_path;

// n consecutive timepoints (in minutes, for example 56, 57, 58, 59); killing process should be on last timepoint (set this in kill_processes.js)
var kill_time = [56, 57, 58, 59];

var firstCrawl = undefined;

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});

var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

const firefox = require('selenium-webdriver/firefox');

if(headlessMode){
	
	var options = new firefox.Options()
	.setProfile(config.browser_profile_path)
	.headless();
	
}else{
	
	var options = new firefox.Options()
	.setProfile(config.browser_profile_path);
	
}

function log_error(txt, trace=true){
	
	if(log_level.errors){
		console.log("\n");
		console.log(new Date());
		if(trace)console.trace();
		console.log(txt);
	}
	
}

function log_info(txt){
	
	if(log_level.info){
		console.log(txt);
	}
	
}

function checkUrl(url){
	
	var parsed = URL(url);
	
	if(parsed.protocol != 'http:' && parsed.protocol != 'https:'){
		return false;
	}
	
	if((!parsed.pathname || parsed.pathname.length < 2) && !parsed.query){
	 	return false;
	}
	
	
	return true;
	
}

function check_jsession(url){
	
	if(url.indexOf(";jsessionid") > -1){

		var jsess_pos = url.indexOf(";jsessionid");

		if(url.indexOf("?") < jsess_pos){
			log_info("found jsession in url - now removing");
			return url.substr(0, jsess_pos);
		}else{
			return false
		}

	}else{
		return url
	}
	
}

function crawl(id, doi, url, url_old){

	log_info("\nnow crawling.\n");

	driver.get(url).then(function(){
		
		driver.sleep(8000).then(function(){
			
			var theTime = new Date();

			driver.getCurrentUrl().then(function(url_selenium){

					log_info("SELENIUM: "+url_selenium);

					var quit = false;

					var doi_urlEnc = encodeURIComponent(doi);

					if(url_selenium.indexOf(doi) >= 0){

						url_selenium = url_selenium.substr(0, url_selenium.indexOf(doi) + doi.length);
						quit = true;

					}else if(url_selenium.indexOf(doi_urlEnc) >= 0){

						url_selenium = url_selenium.substr(0, url_selenium.indexOf(doi_urlEnc) + doi_urlEnc.length);
						quit = true;

					}

					if(quit){

						log_info("QUIT (doi in url)");

						handle_url(url_old, url_selenium, id);
						
						return;
						
					}

					var url_parsed = new URL(url_selenium);
					log_info("");

					log_info("QUERY: "+url_parsed.query);
					log_info("HASH: "+url_parsed.hash);
					log_info("");

					var doi_upper = doi.toUpperCase();

					if(url_parsed.query === '' && url_parsed.hash == ''){

						log_info("no params");

						driver.getPageSource().then(function(pageSource1){

							var pageSource1_upper = pageSource1.toUpperCase();

							if(pageSource1_upper.includes(doi_upper) || pageSource1_upper.includes(encodeURIComponent(doi_upper))){
								log_info("doi identified in source code");
							}else{

								log_info("doi not found in source code 1");

								if(url_parsed.pathname.substr(-4) == '.pdf'){
									log_info("maybe is pdf file");
									
									try{
									
										pdfCheck_url(url_selenium, tmp_path, doi, function(){

											log_info("doi found in pdf");

											if (check_jsession(url_selenium)){
												var url_selenium_noJSession = check_jsession(url_selenium);
											}else{
												log_info("jsession before url params");
												only_update_lu(theTime, id);
												return
											}

											log_info(url_selenium_noJSession);

											if(!checkUrl(url_selenium_noJSession)){

												log_info("invalid url");
												only_update_lu(theTime, id);

											}else{

												handle_url(url_old, url_selenium_noJSession, id);

											}

										},(e)=>{
											log_info("NOT FOUND: "+e);
											only_update_lu(theTime, id);
										});
									}catch(e){
										// could not read pdf
										error_log("could not read file with pdf reader");
									}
										
									return

								}else{
									only_update_lu(theTime, id);
									return;
								}

							}

							if (check_jsession(url_selenium)){
								var url_selenium_noJSession = check_jsession(url_selenium);
							}else{
								log_info("jsession before url params");
								only_update_lu(theTime, id);
								return
							}

							log_info(url_selenium_noJSession);

							if(!checkUrl(url_selenium_noJSession)){

								log_info("invalid url");
								only_update_lu(theTime, id);

							}else{

								handle_url(url_old, url_selenium_noJSession, id);
								
							}

						}).catch(function(e){
							log_error(e);
							only_update_lu(theTime, id);
						});

					}else{

						driver.getTitle().then(function(theTitle1){

							driver.getPageSource().then(function(pageSource1){

								var url_selenium_clean = url_parsed.protocol+'//'+url_parsed.host+url_parsed.pathname;

								log_info("CLEAN: "+url_selenium_clean);
								
								try{

									driver.quit()
									.then(function(){

										driver = new webdriver.Builder()
											.forBrowser('firefox')
											.setFirefoxOptions(options)
											.build();

										log_info("\nwebdriver built.");

										driver.manage().setTimeouts({pageLoad: pageLoadTimeout})

										.then(function(){
											
											driver.get(url_selenium_clean).then(function(){

												driver.getPageSource().then(function(pageSource2){
													
													var pageSource2_upper = pageSource2.toUpperCase();
													
													if(pageSource2_upper.includes(doi_upper) || pageSource2_upper.includes(encodeURIComponent(doi_upper))){

														log_info("doi identified in source code 2");
																
														driver.getCurrentUrl().then(function(url_selenium_afterNoQueryNoHash){

															if(url_selenium_clean == url_selenium_afterNoQueryNoHash && checkUrl(url_selenium_clean)){

																log_info("same urls");
																
																handle_url(url_old, url_selenium_clean, id);

															}else if(url_selenium_afterNoQueryNoHash == url_selenium && checkUrl(url_selenium_clean)){
																
																// wenn url clean auf url umleitet, kann clean url genutzt werden für Api-Suchen (größerer suchbereich, url muss eindeutig mit doi verknüpft sein)
																
																log_info('url clean load not clean url, but url sel');
																
																handle_url(url_old, url_selenium_clean, id);
																
															}else{
																only_update_lu(theTime, id);
															}

														}).catch(function(e){
															only_update_lu(theTime, id);
														});

													}else{

														log_info("doi not found in source code 2");

														var pageSource1_upper = pageSource1.toUpperCase();

														if(pageSource1_upper.includes(doi_upper) || pageSource1_upper.includes(encodeURIComponent(doi_upper))){

															log_info("but doi found in source code 1");

															if (check_jsession(url_selenium)){
																var url_selenium_noJSession = check_jsession(url_selenium);
															}else{
																log_info("jsession before url params");
																only_update_lu(theTime, id);
																return
															}

															handle_url(url_old, url_selenium_noJSession, id);
															
														}else{

															log_info("and doi not found in source code 1");
															only_update_lu(theTime, id);

														}

													}

												}).catch(function(e){

													log_error(e);
													only_update_lu(theTime, id);

												});

											}).catch(function(e){

												if(e.name != 'TimeoutError'){
													log_error(e);
												}
												only_update_lu(theTime, id);

											});
											
										}).catch(function(){setTimeout(function(){running = false;}, 1000);});

									});

								}catch(e){

									setTimeout(function(){running = false;}, 1000);

								}
								
							}).catch(function(e){
								log_error(e);
								only_update_lu(theTime, id);
							});

						}).catch(function(e){log_error(e);running = false;});

					}

				}).catch(function(e){
                    log_error("BROWSER COULD NOT FETCH URL");
                    log_error(e);running = false;
                    theTime = new Date();
                    only_update_lu(theTime, id);
                });
		
		}).catch(function(e){log_error(e);running = false;});
		
	}).catch(function(e){

		if(e.name != 'TimeoutError'){
			log_error(e);
		}

		theTime = new Date();
		only_update_lu(theTime, id);

	});

	
}

function only_update_lu(theTime, id){

	con.query('UPDATE works SET last_update_url_browser = ? WHERE id = ?', [theTime, id], function(err, res, fields){

		if(err){
			log_error("MYSQL ERROR\n"+err);
		}else{
			log_info("Only updated last_update_url_browser");
		}
	});
	
	if(url_crawled === 0){

		con.query('UPDATE works SET url_crawled = 1 WHERE id = ?', [id], function(err, res, fields){

			if(err){
				log_error("MYSQL ERROR\n"+err);
			}else{
				log_info("Only updated last_update_url_browser");
			}
		});
		
	}
	
	running = false;
	
}

function strip_prot(url){
	
	if(url.substr(0,6) == "https:"){

		return ["https", url.substr(8)];

	}else{

		return ["http", url.substr(7)];

	}
	
	
}

function handle_url(url_old, url, work_id){
	
	var theTime = new Date();
	
	if(url_old == null){
		
		// 1st time url found
		
		var sql = "UPDATE works SET url = ?, last_update_url_browser = ? WHERE id = ?";
			
		con.query(sql, [url, theTime , work_id], function(err, results, fields){

			if(err){
				log_error(err);
			}else{
				log_info("UPDATED url works");							
			}
			running = false;
		});
		
		if(url_crawled === 0){

			con.query('UPDATE works SET url_crawled = 1 WHERE id = ?', [work_id], function(err, res, fields){

				if(err){
					log_error("MYSQL ERROR\n"+err);
				}else{
					log_info("Only updated last_update_url_browser");
				}
			});

		}
		
		return
		
	}


	var url_old = url_old.toLowerCase();
	
	var url = url.toLowerCase();
	
	if(url_old == url){
		
		// identische urls
		log_info("identische urls");
		only_update_lu(theTime, work_id);
		
	}else{
		
		// unterschiedliche urls (durch untersch. Protokoll oder Rest)
		
		var url_old_no_prot = strip_prot(url_old)[1];
		
		var url_no_prot;
		var url_prot;
		
		[url_prot, url_no_prot] = strip_prot(url);
		
		var url_md5_ss16 = md5(url_no_prot).substr(0,16);
		var url_old_md5_ss16 = md5(url_old_no_prot).substr(0,16);
		
		if(url_old_no_prot == url_no_prot){
			
			// nur unterschiedliches Protokoll
			
			log_info("nur untersch. protokoll");
			
			var sql = "SELECT id FROM urls WHERE work_id = ? AND hash = ? AND url = ? LIMIT 1";
			
			con.query(sql, [work_id, url_md5_ss16, url_no_prot], function(err, results, fields){
				
				if(err){
					log_error(err);
					running = false;
				}else{
					
					if(results.length == 0){
						
						// url ist nicht in urls table (Annahme: bisher nur 1 url)
						
						log_info("url ist nicht in urls table");
						
						con.query('UPDATE works SET url = ?, last_update_url_browser = ? WHERE id = ?', [url, theTime, work_id], function(err, res, fields){

							if(err){
								log_error("MYSQL ERROR\n"+err);
							}else{
								log_info("Updated browser url ("+url+")");
							}
							
							running = false;

						});
						
					}else{
						
						var urls_id = results[0].id;
						
						// url ist in urls table
						
						log_info("url ist in urls table");
						
						if(url_prot == "http"){
							var url_prot_nr = 0;
						}else{
							var url_prot_nr = 1;
						}
						
						con.query('UPDATE works SET url = ?, urls = 1, last_update_url_browser = ? WHERE id = ?', [url, theTime, work_id], function(err, res, fields){

							if(err){
								log_error("MYSQL ERROR\n"+err);
							}else{
								log_info("Updated browser url ("+url+")");
							}
							
							running = false;

						});
						
						con.query('UPDATE urls SET prot = ? WHERE id = ?', [url_prot_nr, urls_id], function(err, res, fields){

							if(err){
								log_error("MYSQL ERROR\n"+err);
							}else{
								log_info("Updated prot in urls table");
							}
							
						});
						
					}
					
				}
				
			});
			
		}else{
			
			// andere url (nicht nur durch evtl. anderes Protokoll)
			log_info("andere url (nicht nur prot)");
			
			var sql = "SELECT id FROM urls WHERE work_id = ? AND hash = ? AND url = ? LIMIT 1";
			
			con.query(sql, [work_id, url_old_md5_ss16, url_old_no_prot], function(err, results, fields){
			
				if(err){
					log_error(err);
					running = false;
				}else{
					
					if(results.length == 0){
						
						// old url nicht in urls table
						
						if(url_old.substr(0,6) == "https:"){
										
							var url_old_prot_nr = 1;

						}else{

							var url_old_prot_nr = 0;

						}
						
						if(url.substr(0,6) == "https:"){
										
							var url_prot_nr = 1;

						}else{

							var url_prot_nr = 0;

						}
						
						
						con.query('SELECT reaction_count_facebook, comment_count_facebook, share_count_facebook, comment_plugin_count_facebook, count_reddit FROM works WHERE id = ?', [work_id], function(err, results, fields){
							
							if(err){
								log_error(err);
								running = false;
							}else{
								
								var result = results[0];
								
								var reaction_count_facebook = result.reaction_count_facebook;
								var comment_count_facebook = result.comment_count_facebook;
								var share_count_facebook = result.share_count_facebook;
								var comment_plugin_count_facebook = result.comment_plugin_count_facebook;
								var count_reddit = result.count_reddit;
								
								
								con.query('INSERT INTO urls (work_id, hash, prot, url, reaction_count_facebook, comment_count_facebook, share_count_facebook, comment_plugin_count_facebook, count_reddit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [work_id, url_old_md5_ss16, url_old_prot_nr, url_old_no_prot, reaction_count_facebook, comment_count_facebook, share_count_facebook, comment_plugin_count_facebook, count_reddit], function(err, res, fields){

									if(err){
										log_error("MYSQL ERROR\n"+err);
									}else{
										log_info("Inserted browser url (old) and result values into urls ("+url_old+")");
									}
									
									con.query('INSERT INTO urls (work_id, hash, prot, url) VALUES (?, ?, ?, ?)', [work_id, url_md5_ss16, url_prot_nr, url_no_prot], function(err, res, fields){

										if(err){
											log_error("MYSQL ERROR\n"+err);
										}else{
											log_info("Inserted browser url into urls ("+url+")");
										}

									});

								});

								
								
								con.query('UPDATE works SET url = ?, urls = 1 WHERE id = ?', [url, work_id], function(err, res, fields){

									if(err){
										log_error("MYSQL ERROR\n"+err);
									}else{
										log_info("Updated works with url ("+url+") and urls = 1");
									}
									
									running = false;

								});
								
							}
							
						});
						
					}else{
						
						// old url is in urls table

						var sql = "SELECT id FROM urls WHERE work_id = ? AND hash = ? AND url = ? LIMIT 1";

						con.query(sql, [work_id, url_md5_ss16, url_no_prot], function(err, results, fields){

							if(err){
								log_error(err);
								running = false;
							}else{
								
								if(results.length == 0){
									
									// url nicht in urls table
									
									if(url.substr(0,6) == "https:"){
										
										var url_prot_nr = 1;
										
									}else{
										
										var url_prot_nr = 0;
										
									}
									
									con.query('INSERT INTO urls (work_id, hash, prot, url) VALUES (?, ?, ?, ?)', [work_id, url_md5_ss16, url_prot_nr, url_no_prot], function(err, res, fields){

										if(err){
											log_error("MYSQL ERROR\n"+err);
										}else{
											log_info("Inserted browser url into urls ("+url_no_prot+")");
										}

									});
									
									con.query('UPDATE works SET url = ?, urls = 1, last_update_url_browser = ? WHERE id = ?', [url, theTime, work_id], function(err, res, fields){

										if(err){
											log_error("MYSQL ERROR\n"+err);
										}else{
											log_info("Updated browser url in works table ("+url+")");
										}

										running = false;

									});
									
								}else{
									
									// ist in urls table
									
									con.query('UPDATE works SET url = ?, urls = 1, last_update_url_browser = ? WHERE id = ?', [url, theTime, work_id], function(err, res, fields){

										if(err){
											log_error("MYSQL ERROR\n"+err);
										}else{
											log_info("Updated browser url in works table ("+url+")");
										}

										running = false;

									});
									
								}

							}

						});
					
				}
			
			}
				
		});
			
		}
		
	}
	
}


function resolve_doi(){
	
	if(running){
		return
	}else{
		
		var theTime = new Date();
		var minutes = theTime.getMinutes();
		
		if(kill_time.includes(minutes)){
			log_info("Waiting for end of kill_time");
			return
		}
		
		running = true;
	}
	
	log_info("\n===========================================================\n");
	log_info("resolve cycle started.\n");

	var sql = `select id, doi, url, committed_doi_resolve, url_crawled from (SELECT id, doi, url, committed_doi_resolve, url_crawled FROM works ORDER BY last_update_url_browser ASC LIMIT ${pool_size_commit}) AS subset order by rand() LIMIT 1`;
	// Testing queries
	//var sql = `select id, doi, url, committed_doi_resolve from (SELECT id, doi, committed_doi_resolve FROM works WHERE url IS NULL ORDER BY last_update_url_browser ASC LIMIT 1500) AS subset order by rand() LIMIT 1`;
	//var sql = "SELECT id, doi, url, committed_doi_resolve FROM works where id = 37137";

	con.query(sql, function(err, results, fields){

		if(err){
			log_error(err);
			setTimeout(function(){running = false;}, 3000);
		}else if(results[0]){
			
			var id = results[0].id;
			var doi = results[0].doi;
			
			var url_old = results[0].url;
			
			url_crawled = results[0].url_crawled;
			
			var committed = results[0].committed_doi_resolve;
			
			var theTime = new Date();
			
			if(committed != null){
				
				var committed_date = new Date(committed);	
				
				var diff_s = (theTime - committed_date) / 1000;
				
				if(diff_s < 300){
					log_info("\nID: "+id+", DOI: "+doi+"\nalready committed "+diff_s+" seconds ago.");
					running = false;
					return;
				}
				
			}
			
			con.query('UPDATE works SET committed_doi_resolve = ? WHERE id = ?', [theTime, id], function(err, res, fields){if(err){log_error(err);}});	
			
			var reqURL = encodeURI(doi_endpoint+doi);
			log_info(reqURL);
			request(reqURL, {json: true}, function(err, res, body){
				
				if(err){
					log_error("\nAPI ERROR:\n"+err, false);
					setTimeout(function(){running = false;}, 3000);
				}else{
					
					//log_info("doi api - body.responseCode = "+body.responseCode);
					log_info(body);
					if(body.responseCode == 1){

						var values = body.values;

						if(Array.isArray(values)){
							
							var found = false;

							values.forEach(function(el, idx){

								if(el.type == "URL"){
									
									found = true;

									var url = el.data.value;

									log_info("\nressource url: "+url);

									try{
									
										driver.quit()
										.then(function(){

											driver = new webdriver.Builder()
												.forBrowser('firefox')
												.setFirefoxOptions(options)
												.build();

											log_info("\nwebdriver built.");

											driver.manage().setTimeouts({pageLoad: pageLoadTimeout})

											.then(function(){

												crawl(id, doi, url, url_old);

											}).catch(function(e){log_error("cannot set browser parameters");setTimeout(function(){running = false;}, 3000);});

										}).catch(function(e){

											driver = new webdriver.Builder()
												.forBrowser('firefox')
												.setFirefoxOptions(options)
												.build();

											log_info("\nwebdriver built.");

											driver.manage().setTimeouts({pageLoad: pageLoadTimeout})

											.then(function(){

												crawl(id, doi, url, url_old);

											}).catch(function(){log_error("cannot set browser parameters");setTimeout(function(){running = false;}, 3000);});

										});
										
									}catch(e){
										
										driver = new webdriver.Builder()
											.forBrowser('firefox')
											.setFirefoxOptions(options)
											.build();

										log_info("\nwebdriver built.");

										driver.manage().setTimeouts({pageLoad: pageLoadTimeout})

										.then(function(){

											crawl(id, doi, url, url_old);

										}).catch(function(){log_error("cannot set browser parameters");setTimeout(function(){running = false;}, 3000);});
										
									}
										
								}else{
									
									if(idx == values.len - 1 && !found){
										
										// potentielle Endlosschleife, evtl. tries einfügen
										
										log_error("NO URL PROVIDED BY DOI API");

										theTime = new Date();
										only_update_lu(theTime, id);
										
									}
								}
							});

						}else{
							log_error("API ERROR: UNEXPECTED DATA STRUCTURE", false);
							theTime = new Date();
							only_update_lu(theTime, id);
						}

					}else{
						log_error("API ERROR", false);
						theTime = new Date();
						only_update_lu(theTime, id);
					}

				}					

			});
		}else{
			log_info('Query returned no results.');
			setTimeout(function(){running = false;}, 300 * 1000);
		}

	});
	
}


con.connect(function(err){

	if(err){
		throw err;
	}else{
		log_info("\nConnected to MySQL database.");
		resolve_doi();
		setInterval(resolve_doi,250);		
	}

});
