const mysql = require('mysql');
const { exec } = require('child_process');

var config = require('./config.json');

var project_root = config.project_root;

try{

	var config = require('./config.json');

}catch(e){

	console.log("Could not load config.json. Make sure it exists and is set up properly.");
	process.exit();

}

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});


sql = "UPDATE mb_sys SET sysRunning = 1;";

con.query(sql, function(err, results, fields){
	
	if(!err){

		exec('forever start '+project_root+'/agents/Youtube/agent_youtube.js && forever start '+project_root+'/agents/Reddit/agent_reddit.js && forever start '+project_root+'/agents/Facebook/agent_facebook.js && forever start '+project_root+'/agents/Wikipedia/agent_wikipedia.js && forever start '+project_root+'/agents/Mendeley/agent_mendeley.js && forever start '+project_root+'/agents/Twitter/agent_twitter.js && forever start '+project_root+'/agents/_doi_agents/doi_resolver_browser.js && forever start '+project_root+'/agents/_doi_agents/doi_resolver_browser.js && forever start '+project_root+'/agents/_doi_agents/doi_resolver_browser.js && forever start '+project_root+'/agents/_doi_agents/kill_processes.js && forever start '+project_root+'/agents/_checkbot/checkbot.js', (err, stdout, stderr) => {

			if(err){
				console.log(err);
				process.exit();
			}else{
				console.log(stdout);
				exec('forever list', function(err, stdout, stderr){

					console.log(stdout);
					process.exit();

				});
			}

		});
		
	}else{
		
		console.log("Could not start services (mb_sys error)\n");
		process.exit();
		
	}
	
});
