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

for(let val of wikis){
	
	running[val] = false;	
	
}

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});


// set log levels
var log_level = {info: true, errors: true};

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
	
	var sql = "SELECT wikipedia.work_id, works.doi FROM wikipedia LEFT JOIN works ON wikipedia.work_id = works.id ORDER BY _"+subdom+" ASC LIMIT 1";

	con.query(sql, function(err, results, fields){
	
		if(err){
			log_error(err);
			running[subdom] = false;
			return
		}
		
		var work_id = results[0].work_id;
		var doi = results[0].doi;
		
		var doi_esc = encodeURIComponent(doi);
		
		var options = {
	
			url: 'https://'+subdom+'.wikipedia.org/w/api.php?action=query&list=search&srlimit='+wiki_srlimit+'&srsearch=%22doi:'+doi_esc+'%22&srwhat=text&srprop&srinfo=totalhits&srenablerewrites=0&format=json',
			headers: {

				"User-Agent": config.user_agent_headers.wikipedia

			},
			timeout: 10*1000
		
		};
		
		request.get(options, function(err, response, body){
			
			try{
				
				if(err){
					handle_error(err, work_id, subdom);
				}
				
				var json = JSON.parse(body);
				
				if(json.hasOwnProperty('query') && json.query.hasOwnProperty('searchinfo') && json.query.searchinfo.hasOwnProperty('totalhits')){
				
					var wiki_count = parseInt(json.query.searchinfo.totalhits);
					
					log_info('\n'+subdom+': '+wiki_count+' hit(s) for doi '+doi);
					
					var theTime = new Date();
				
					var sql = "UPDATE wikipedia SET "+subdom+" = ?, _"+subdom+" = ? WHERE work_id = ?";

					con.query(sql, [wiki_count, theTime, work_id], function(err, results, fields){

						if(err){
							log_error(err);
						}else{
							//log_info(subdom+": work updated.");
							
							if(wiki_count > 0){
							
								var sql_dump = "INSERT INTO data_dumps_wikipedia (wiki, work_id, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE data = ?, created = ?";

								con.query(sql_dump, [subdom, work_id, body, body, theTime], function(err, results, fields){

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
				
	var sql = "UPDATE wikipedia SET _"+subdom+" = ? WHERE work_id = ?";
	
	log_error(subdom+": "+e);

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
