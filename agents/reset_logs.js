var fs = require('fs');

const { exec } = require('child_process');

var config = require('./config.json');

var forever_log_path = config.forever_log_path+'/';

var files = fs.readdirSync(forever_log_path);

var logs = [];

for(var i = 0; i < files.length; i++){
	
	var fname = files[i];
	
	if(fname.substr(-4, 4) == '.log'){
		logs.push(fname);
	}
	
}

if(logs.length > 0){
	
	var cmd = '> '+forever_log_path+logs.join('; > '+forever_log_path);

	console.log(logs);
	console.log(cmd);
	
	
	exec(cmd, (err, stdout, stderr) => {

		if(err){
			console.log(err);
		}else{
			console.log(stdout);
		}

	});
	
	
}

