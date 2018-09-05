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

var cooldown = 1100;

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

function mendeley_doi_catalog_search(doi, reader_count_old, group_count_old, accessToken, work_id, doNext){

	var doi_esc = encodeURIComponent(doi);
	
	var options = {
	
		url: 'https://api.mendeley.com/catalog?doi='+doi_esc+'&view=stats',
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
			
			try{

				if(JSON.parse(body).hasOwnProperty('errorId')){
					log_error("ERROR\n"+body);
					running = false;
					return;
				}else{
					doNext(reader_count_old, group_count_old, JSON.parse(body)[0]);		
				}
				
			}catch(e){
				
				log_error(e);
				
				var theTime = new Date();
				
				var sql = "UPDATE works SET last_update_mendeley = ? WHERE id = ?";

				con.query(sql, [theTime, work_id], function(err, results, fields){

					if(err){
						log_error(err);
					}else{
						log_info("\nworks updated.");
					}

					running = false;

				});
				
			}

		}
		
	}
	
	log_info("\ncalling mendeley api with token \""+accessToken+"\"\n");
	
	request(options, callback);
	
	
}

function result2db(work_id, reader_count_old, group_count_old, result){
	
	if(result && result.hasOwnProperty('reader_count') && result.hasOwnProperty('group_count')){
		
		var theTime = new Date();
		var reader_count = result.reader_count;
		var group_count = result.group_count;
		
		var diff_reader_count = reader_count - reader_count_old;
		var diff_group_count = group_count - group_count_old;
		
		var diff_string_reader_count = '';
		var diff_string_group_count = '';
		
		if(diff_reader_count > 0){
			diff_string_reader_count = ' (+'+diff_reader_count+')';
		}
		
		if(diff_group_count > 0){
			diff_string_group_count = ' (+'+diff_group_count+')';
		}
		
		log_info("reader_count: "+reader_count+diff_string_reader_count);
		log_info("group_count: "+group_count+diff_string_group_count);

		var sql = "UPDATE works SET reader_count_mendeley = ?, group_count_mendeley = ?, last_update_mendeley = ? WHERE id = ?";
		
		con.query(sql, [reader_count, group_count, theTime, work_id], function(err, results, fields){

			if(err){
				log_error(err);
			}else{
				log_info("\nworks updated.");
			}
			
			if(result.hasOwnProperty('id')){
				var mendeley_id = result.id;
			}else{
				var mendeley_id = null;
			}
			
			if(err){
				log_error(err);
				running = false;
				return;
			}else{

				var sql_dump = "INSERT INTO data_dumps_mendeley (work_id, obj_id, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE obj_id = ?, data = ?, created = ?";

				var result_string = JSON.stringify(result);

				con.query(sql_dump, [work_id, mendeley_id, result_string, mendeley_id, result_string, theTime], function(err, results, fields){
					if(err){
						log_error(err);
					}
				});

				running = false;

			}
			
		});

	}else{

		log_info("API ERROR: unexpected data structure");
		log_info(result);
		
		var sql = "UPDATE works SET  last_update_mendeley = ? WHERE id = ?";

		var theTime = new Date();
		
		con.query(sql, [theTime, work_id], function(err, results, fields){

			if(err){
				log_error(err);
			}else{
				log_info("\nworks updated.");
			}
			
			running = false;

		});
		
		running = false;
		return;

	}
	
}


function startCycle(){
	
	sysRunning.check(con, function(shouldRun){
		
		if(shouldRun){
	
			var sql = "SELECT id, doi, reader_count_mendeley, group_count_mendeley FROM works ORDER BY last_update_mendeley ASC LIMIT 1";

			con.query(sql, function(err, results, fields){

				if(err){
					// set last_update
					log_error(err);
					running = false;
					return;
				}else{

					var work_id = results[0].id;
					var doi = results[0].doi;

					var reader_count = results[0].reader_count_mendeley;
					var group_count = results[0].group_count_mendeley;

					log_info("");
					log_info("==========================================================================================================\n");
					log_info("work_id: "+work_id);
					log_info("doi: "+doi);

					mendeley_doi_catalog_search(doi, reader_count, group_count, tokenObj.access_token, work_id, function(reader_count_old, group_count_old, result){

						result2db(work_id, reader_count_old, group_count_old, result);

					});


				}

			});
			
		}else{
			log_info("I should not run.");
			running = false;
		}
		
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


