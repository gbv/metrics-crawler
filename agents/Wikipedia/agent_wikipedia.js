console.log("agent wikipedia");

const mysql = require('mysql');
const request = require('request');

var config = require('../config.json');

const sysRunning = require('../modules/sysRunning.js');

var cooldown = 1200;

var should_run;

if(cooldown%2 != 0){
	cooldown++;
}

var wikis = ["en", "de", "ceb", "sv", "fr", "nl", "ru", "it", "es", "pl", "war", "vi", "ja", "zh", "pt", "uk", "sr", "fa", "ca", "ar"];

var running = {};

var wiki_srlimit = 500;

var durchgang = {};
var alt = {};

for(let val of wikis){
	
	running[val] = false;
	durchgang[val] = 0;
	alt[val] = false;
	
}

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

function crawl(subdom){
	
	if(!should_run){
		log_info("I should not run "+(subdom)+".");
		return
	}
	
	if(running[subdom]){
		log_info("\n"+subdom+" running thus no new cycle.");
		return;
	}else{
		running[subdom] = true;
	}
	
				
	if([0,1].includes(durchgang[subdom])){
		alt[subdom] = false;
	}else{
		alt[subdom] = true;
	}
	
	if(durchgang[subdom] > 1){
		durchgang[subdom] = 0;
	}else{
		durchgang[subdom] += 1;
	}
	
	if(!alt[subdom]){
		var sql = "SELECT wikipedia.work_id, works.doi FROM wikipedia LEFT JOIN works ON wikipedia.work_id = works.id ORDER BY _"+subdom+" ASC LIMIT 1";	
		
	}else{
		
		var sql = "SELECT wikipedia_alt.work_alt_id, metadata_econStor.data FROM wikipedia_alt LEFT JOIN metadata_econStor ON wikipedia_alt.work_alt_id = metadata_econStor.work_alt_id ORDER BY _"+subdom+" ASC LIMIT 1";
		
	}
	
	con.query(sql, function(err, results, fields){
	
		if(err){
			log_error(err);
			running[subdom] = false;
			return
		}
		
		if(!alt[subdom]){
			
			var work_id = results[0].work_id;
			var doi = results[0].doi;
			
		}else{
			
			var work_alt_id = results[0].work_alt_id;
			var data = results[0].data;

		}

		if(!alt[subdom]){
			
			if(!doi){
				log_error("No doi provided. Maybe work is not in works table but in wikipedia table.");
				return
			}
			
			var doi_esc = encodeURIComponent(doi);
			var query = 'action=query&list=search&srlimit='+wiki_srlimit+'&srsearch=%22doi:'+doi_esc+'%22&srwhat=text&srprop&srinfo=totalhits&srenablerewrites=0&format=json';
			
		}else{
			
			try{
				
				var isbn = null;
				var idents = JSON.parse(data)["OAI-PMH"].GetRecord[0].record[0].metadata[0]["oai_dc:dc"][0]["dc:identifier"];
				
				for(let el of idents){
					
					el = el.toLowerCase();
					
					if(el.substr(0,9) == "urn:isbn:"){
						
						let x = el.substr(9).trim();
						
						if(x.replace(/[^x\d]/g, '').length >= 10 && !(/[^0-9^\-^x]+/g.test(x))){
							isbn = x;
						}
						
						break
						
					}
					
				}
				
			}catch(e){
				
				handle_error(e, work_alt_id, subdom);
				return
				
			}
			
			if(!isbn){
				handle_error(null, work_alt_id, subdom);
				return
			}
			
			var isbn_esc = encodeURIComponent(isbn);
			var query = 'action=query&list=search&srlimit='+wiki_srlimit+'&srsearch=%22isbn:'+isbn_esc+'%22&srwhat=text&srprop&srinfo=totalhits&srenablerewrites=0&format=json';
			
		}
		
		var options = {
	
			url: 'https://'+subdom+'.wikipedia.org/w/api.php?'+query,
			headers: {

				"User-Agent": config.user_agent_headers.wikipedia

			},
			timeout: 10*1000
		
		};

		request.get(options, function(err, response, body){
			
			try{
				
				if(err){
					if(alt)work_id=work_alt_id;
					handle_error(err, work_id, subdom);
				}
				
				var json = JSON.parse(body);
				
				if(json.hasOwnProperty('query') && json.query.hasOwnProperty('searchinfo') && json.query.searchinfo.hasOwnProperty('totalhits')){
				
					var wiki_count = parseInt(json.query.searchinfo.totalhits);
					
					var theTime = new Date();
				
					if(!alt[subdom]){
						
						log_info('\n'+subdom+': '+wiki_count+' hit(s) for doi '+doi);
						var sql = "UPDATE wikipedia SET "+subdom+" = ?, _"+subdom+" = ? WHERE work_id = ?";
						
					}else{
						log_info('\n'+subdom+': '+wiki_count+' hit(s) for isbn '+isbn);
						var sql = "UPDATE wikipedia_alt SET "+subdom+" = ?, _"+subdom+" = ? WHERE work_alt_id = ?";
						
					}
					
					if(!alt[subdom]){
				
						con.query(sql, [wiki_count, theTime, work_id], function(err, results, fields){

							if(err){
								log_error(err);
							}else{
								//log_info(subdom+": work updated.");
								
								if(wiki_count > 0){
								
									var sql_dump = "INSERT INTO data_dumps_wikipedia (wiki, work_id, data, query) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE data = ?, query = ?, created = ?";

									con.query(sql_dump, [subdom, work_id, body, query, body, query, theTime], function(err, results, fields){

										if(err){
											log_error(err);
										}

									});
									
									if(wiki_count > wiki_srlimit){
										
										log_error("more results than srlimit for work with id "+work_id+" at "+subdom+" wiki");
										
									}
									
								}
								
							}

							running[subdom] = false;

						});
						
					}else{
						
						con.query(sql, [wiki_count, theTime, work_alt_id], function(err, results, fields){

							if(err){
								log_error(err);
							}else{
								//log_info(subdom+": work updated.");
								
								if(wiki_count > 0){
								
									var sql_dump = "INSERT INTO data_dumps_wikipedia_alt (wiki, work_alt_id, data, query) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE data = ?, query = ?, created = ?";

									con.query(sql_dump, [subdom, work_alt_id, body, query, body, query, theTime], function(err, results, fields){

										if(err){
											log_error(err);
										}

									});
									
									if(wiki_count > wiki_srlimit){
										
										log_error("more results than srlimit for work with id "+work_alt_id+" at "+subdom+" wiki");
										
									}
									
								}
								
							}

							running[subdom] = false;

						});
						
					}
					
				}else{
					throw 'Unexpected object format'
				}
					
			}catch(e){
				
				handle_error(e, work_id, subdom);
				
			}
		
		});
	
	
	});
	
}

function handle_error(e, id, subdom){
	
	var theTime = new Date();
	
	if(!alt[subdom]){
		
		var sql = "UPDATE wikipedia SET _"+subdom+" = ? WHERE work_id = ?";
		
	}else{
		
		var sql = "UPDATE wikipedia_alt SET _"+subdom+" = ? WHERE work_alt_id = ?";
		
	}
	
	if(e)log_error(subdom+": "+e);
	
	con.query(sql, [theTime, id], function(err, results, fields){

		if(err){
			log_error(subdom+": "+err);
		}else{
			//log_info("\nwork updated.");
		}

		running[subdom] = false;

	});
	
}


con.connect(function(err){

	if(err){
		
		log_error("MYSQL ERROR:\n"+err);
		
	}else{
		
		log_info("\nConnected to MYSQL database.");
		
		sysRunning.check(con, function(shouldRun){
			
			should_run = shouldRun;
			
			setInterval(function(){
				
				sysRunning.check(con, function(shouldRun){
				
					should_run = shouldRun;
					
				});
				
			}, 3000);

			for(var i = 0; i < wikis.length; i++){

				(function(wiki){

					setInterval(function(){
						crawl(wiki);
					}, cooldown);

				})(wikis[i]);

			}
			
		});
		
	}

});
