'use strict';

const mysql = require('mysql');

var config = require('../config.json');

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});


var sql = "SELECT id, data FROM metadata_econStor;";

var keys = {};

con.query(sql, function(err, results, fields){

	if(err){
		console.log(err);
		throw 'err';
	}

	console.log(results.length);
	
	for(let el of results){
		
		let id = el.id;
		let data = JSON.parse(el.data);
		
		try{
		
			var x = data['OAI-PMH'].GetRecord[0].record[0].metadata[0]['oai_dc:dc'][0];
		
		}catch(e){
			continue
		}
		
		if(x.hasOwnProperty('dc:identifier')){
			
			for(let _el of x['dc:identifier']){
				if(_el.includes(':')){
					let key = _el.split(':')[0];
					if(keys.hasOwnProperty(key)){
						keys[key] += 1;
					}else{
						keys[key] = 1;
					}
				}
				
			}
			
		}
		
	}
	
	console.log(keys);
	process.exit();
	
});