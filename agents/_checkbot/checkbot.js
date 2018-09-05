console.log("checkbot");

var sched = require('node-schedule');
const { exec } = require('child_process');
const mysql = require('mysql');

var config = require('../config.json');

const agents_path = config.project_root+'/agents/';

var tolerance = 120; //seconds

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});

function check_service(service_name, lu, theTime, tolerance){
	
	var service_lower = service_name.toLowerCase();
	var service_cap = service_name.charAt(0).toUpperCase() + service_lower.slice(1);
	
	if(theTime - lu > tolerance*1000){

		console.log(service_cap+" failed - now restarting "+theTime);

		exec('forever restart '+agents_path+service_cap+'/agent_'+service_lower+'.js', (err, stdout, stderr) => {

			if(err){
				console.log(err);
				console.log("now trying stop & start "+service_cap);
				exec('forever stop '+agents_path+service_cap+'/agent_'+service_lower+'.js; forever start '+agents_path+service_cap+'/agent_'+service_lower+'.js');
			}else{
				console.log(service_cap+" agent restart command executed");
			}

		});

	}
	
}

var j = sched.scheduleJob('30 * * * *', function(){

	var sql = "SELECT max(last_update_twitter) as twitter, max(last_update_reddit) as reddit, max(last_update_facebook) as facebook, max(last_update_mendeley) as mendeley, max(last_update_youtube) as youtube from works";

	var theTime = new Date();
	
	con.query(sql, function(err, results, fields){
		
		if(err){
			console.log("mysql error");
			console.log(err);
			return
		}else{
			
			try{
				
				var lu_facebook = new Date(results[0].facebook);
				var lu_mendeley = new Date(results[0].mendeley);
				var lu_reddit = new Date(results[0].reddit);
				var lu_twitter = new Date(results[0].twitter);
				var lu_youtube = new Date(results[0].youtube);
				
				check_service('facebook', lu_facebook, theTime, tolerance);
				check_service('mendeley', lu_mendeley, theTime, tolerance);
				check_service('reddit', lu_reddit, theTime, tolerance);
				check_service('twitter', lu_twitter, theTime, tolerance);
				check_service('youtube', lu_youtube, theTime, 3600);
				
			}catch(e){
				
				console.log(e);
				
			}
			
		}
		
	});
	
	
	sql = "SELECT max(_en) as en, max(_de) as de, max(_ceb) as ceb, max(_sv) as sv, max(_fr) as fr, max(_nl) as nl, max(_ru) as ru, max(_it) as it, max(_es) as es, max(_pl) as pl, max(_war) as war, max(_vi) as vi, max(_ja) as ja, max(_zh) as zh, max(_pt) as pt, max(_uk) as uk, max(_sr) as sr, max(_fa) as fa, max(_ca) as ca, max(_ar) as ar FROM wikipedia;"; 
	
	con.query(sql, function(err, results, fields){
		
		if(err){
			console.log("mysql error");
			console.log(err);
			return
		}else{
			
			try{
				
				var wikis = ["en", "de", "ceb", "sv", "fr", "nl", "ru", "it", "es", "pl", "war", "vi", "ja", "zh", "pt", "uk", "sr", "fa", "ca", "ar"];
				var failed = false;
				
				for(let i = 0; i < wikis.length; i++){
					
					let lu = new Date(results[0][wikis[i]]);
					
					if(theTime - lu > tolerance*1000){
						
						failed = true;
						break
						
					}
					
				}
				
				if(failed){
					
					console.log("WIKI FAILED");
					
					exec('forever restart '+agents_path+'Wikipedia/agent_wikipedia.js', (err, stdout, stderr) => {

						if(err){
							console.log(err);
							console.log("now trying stop & start Wikipedia");
							exec('forever stop '+agents_path+'Wikipedia/agent_wikipedia.js; forever start '+agents_path+'Wikipedia/agent_wikipedia.js');
						}else{
							console.log("Wikipedia agent restart command executed");
						}

					});
					
				}
				
			}catch(e){
				
				console.log("WIKI SCRIPT ERROR");
				console.log(e);
				
			}
			
			
		}
	
	});
	
});

var k = sched.scheduleJob('31 * * * *', function(){
	
	exec('forever cleanlogs');
	
});
