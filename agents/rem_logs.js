const { exec } = require('child_process');

var config = require('./config.json');

var forever_log_path = config.forever_log_path;

exec('rm -rf '+forever_log_path+'/*.log', (err, stdout, stderr) => {

	if(err){
		console.log(err);
	}

	exec('ls '+forever_log_path, (err, stdout, stderr) => {
		
		console.log(stdout);
		
	});

});