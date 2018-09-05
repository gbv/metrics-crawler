console.log("kill processes");

var sched = require('node-schedule');
const { exec } = require('child_process');

var config = require('../config.json');

var kill_timepoint = 59;

var instances_doi_resolver = 3;

var system_tmp = config.system_tmp;

var path_doi_resolver = config.project_root+"/agents/_doi_agents/doi_resolver_browser.js";

var j = sched.scheduleJob(kill_timepoint+' * * * *', function(){

	exec('killall firefox; killall geckodriver; killall \'Web Content\';rm -rf '+config.project_root+'/agents/_doi_agents/tmp/*.pdf; rm -rf '+system_tmp+'/rust_mozprofile.*; rm -rf '+system_tmp+'/GeckoChildCrash*; rm -rf '+system_tmp+'/mozilla_*; rm -rf '+config.download_path+'/*; forever stop '+path_doi_resolver+'; for i in `seq '+instances_doi_resolver+'`; do forever start '+path_doi_resolver+'; done', (err, stdout, stderr) => {

		if(err){
			console.log(err);
		}

	});
	
});
