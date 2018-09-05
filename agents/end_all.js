const { exec } = require('child_process');
var config = require('./config.json');
const mysql = require('mysql');

var done = 0;

var sql;

var shutdown_wait = 5*1000;

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});

console.log("\nShutting down the bot. This will take at least "+shutdown_wait/1000+" seconds.");

sql = "UPDATE works SET committed_doi_resolve = null";

con.query(sql, function(err, results, fields){

	if(err){
		console.log(err);
	}else{
		console.log("\nResolve dates resetted.\n");
	}
	
	if(done==1){
		process.exit();
	}else{
		done += 1;
	}

});

sql = "UPDATE mb_sys SET sysRunning = 0;";

con.query(sql, function(err, results, fields){
	
	if(!err){
	
	setTimeout(function(){
		
			exec('forever stopall', (err, stdout, stderr) => {

				if(err){
					console.log(err);
				}else{
					console.log(stdout);
				}

				exec('killall firefox; killall geckodriver; killall \'Web Content\'', (err, stdout, stderr) => {

					if(err){
						console.log(err)
					}

					if(done==1){
						process.exit();
					}else{
						done += 1;
					}

				});

			});

		}, shutdown_wait);
		
	}else{
		
		console.log("Could not shutdown services (mb_sys error)\n");
		process.exit();
		
	}
	
});