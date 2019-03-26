console.log("agent mendeley");

const mendeley_client_id = process.env.MENDELEY_CLIENT_ID;
const mendeley_client_secret = process.env.MENDELEY_CLIENT_SECRET;

const sysRunning = require('../modules/sysRunning.js');

var config = require('../config.json');

if(typeof(mendeley_client_id) == "undefined" || typeof(mendeley_client_secret) == "undefined"){
	throw "credentials not defined"
}

const mysql = require('mysql');
const request = require('request');

var cooldown = 750;

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
	
	if(!tokenObj.hasOwnProperty('update_timepoint') || tokenObj.update_timepoint < new Date(Date.now())){
		
		var options = {
			method : "POST",
			url: 'https://api.mendeley.com/oauth/token',
			headers: {
				"Content-Type": 'application/x-www-form-urlencoded'
			},
			form:{
				client_id: mendeley_client_id,
				client_secret:mendeley_client_secret,
				grant_type: "client_credentials",
				scope: "all"
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
					
					if(bodyObj.hasOwnProperty('access_token') && bodyObj.hasOwnProperty('expires_in')){
						tokenObj = bodyObj;
						
						tokenObj.update_timepoint = new Date(Date.now() + (parseInt(tokenObj.expires_in)-300)*1000);
						
						log_info("");
						log_info("##########################################################################################################");
						log_info("updated token. new update_timepoint: "+tokenObj.update_timepoint);
						log_info("##########################################################################################################");
						
						console.log(bodyObj.access_token);
						
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
	
	
}

function mendeley_doi_catalog_search(id, title, author, years, accessToken, doNext){

	var title = encodeURIComponent(title.trim());
	var author = author.trim();
	
	author = author.split(' ')[0];
	
	author = author.split(',')[0];
	
	author = encodeURIComponent(author);
	
	var min_year;
	var max_year;
	
	if(years.length==1){
		min_year = parseInt(years[0]);
		max_year = parseInt(years[0]);
	}else if(years.length > 1){
		min_year = parseInt(Math.min.apply(Math, years));
		max_year = parseInt(Math.max.apply(Math, years));
	}else{
		throw 'years format error';
	}
	
	if(!title || !author){
		throw 'no title or author';
	}
	
	let request_url = 'https://api.mendeley.com/search/catalog?title='+title+'&min_year='+min_year+'&max_year='+max_year+'&author='+author+'&limit=10';
	
	var options = {
	
		url: request_url,
      	headers: {
			
			"Authorization": 'Bearer '+ accessToken,
			"Accept":"application/vnd.mendeley-document.1+json"
			
		}
		
	};
	
	function callback(err, response, body){
		
		if(err){
			log_error("ERROR\n"+err);
			running = false;
			return;
		}else{
			
			if(!body || JSON.parse(body).hasOwnProperty('errorId')){
				log_error("ERROR\n"+body);
				only_update_lu(id);
				return;
			}else{
				doNext(id, JSON.parse(body));
			}

		}
		
	}
	
	log_info("\ncalling mendeley api with token \""+accessToken+"\"\n");
	
	request(options, callback);
	
}

function result2db(id, result){
	
	if(result){
		
		var sql = "UPDATE metadata_econStor SET catalog_mendeley = ?, last_update_mendeley = CURRENT_TIMESTAMP WHERE id = ?";
		
		con.query(sql, [JSON.stringify(result), id], function(err, results, fields){

			if(err){
				log_error(err);
			}else{
				log_info("\nworks updated.");
			}

			running = false;
			
		});

	}else{

		log_error('ID '+id+': inexpected data structure (mendeley api response)');
		throw 'inexpected data structure (mendeley api response)';

	}
	
}


function startCycle(){
	
	sysRunning.check(con, function(shouldRun){
		
		if(shouldRun){
	
			var sql = "SELECT id, data FROM metadata_econStor WHERE data is not null ORDER BY last_update_mendeley ASC LIMIT 1";

			con.query(sql, function(err, results, fields){

				if(err){
					// set last_update
					log_error(err);
					running = false;
					return;
				}else{
					
					let id, data, meta, title, creator, date;

					try{
					
						id = results[0].id;
						data = JSON.parse(results[0].data);
						
						meta = data['OAI-PMH'].GetRecord[0].record[0].metadata[0]['oai_dc:dc'][0];

						title = meta['dc:title'][0];
						creator = meta['dc:creator'][0];
						date = meta['dc:date'];
						
					}catch(e){
						log_error(e);
						only_update_lu(id);
						return
					}
					
					log_info("");
					log_info("==========================================================================================================\n");
					log_info("Id: "+id);
					log_info(title);
					log_info(creator);
					log_info(date);

					mendeley_doi_catalog_search(id, title, creator, date, tokenObj.access_token, function(id, result){

						result2db(id, result);

					});
						
				}

			});
			
		}else{
			log_info("I should not run.");
			running = false;
		}
		
	});

}

function only_update_lu(id){
	
	var sql = "UPDATE metadata_econStor SET last_update_mendeley = CURRENT_TIMESTAMP WHERE id = ?";

	con.query(sql, [id], function(err, results, fields){

		if(err){
			throw 'mysql error (in only_update_lu)';
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


