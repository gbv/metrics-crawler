'use strict';

const request = require('request');
var parseString = require('xml2js').parseString;

const mysql = require('mysql');

var config = require('../config.json');

var econStor_endpoint = "https://www.econstor.eu/oai/request";

var econStor_query_tmpl = "?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:econstor.eu:";

var econStor_url_tmpl = econStor_endpoint+econStor_query_tmpl;

var exit_signal = false;

var con = mysql.createConnection({

	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	charset: config.db.charset

});

function makeRequest(){
	
	if(exit_signal){
		process.exit();
		return
	}
	
	var sql = "SELECT id, local_handle FROM works_alt ORDER BY last_fetched_metadata LIMIT 1";
	
	con.query(sql, function(err, results, fields){

		if(err){
			console.log(err);
			throw 'db error';
		}else{
			
			var id = results[0].id;
			var handle = results[0].local_handle;
			
			request(econStor_url_tmpl+handle, { json: false }, (err, res, body) => {
				
				if (err) {
					
					console.log(err);
					setTimeout(makeRequest, 5000);
					return
					
				}

				parseString(body, function (err, result) {
					
					if (err) {
						console.log(err);
						throw 'parsing error';
					}
					
					let json_body = JSON.stringify(result);
					
					sql = "INSERT INTO metadata_econStor (work_alt_id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?, created = ?";
					
					con.query(sql, [id, json_body, json_body, new Date()], function(err, results, fields){

						if(err){
							console.log(err);
							throw 'db error';
						}
							
						sql = "UPDATE works_alt SET last_fetched_metadata = CURRENT_TIMESTAMP WHERE id = ?";

						con.query(sql, [id], function(err, results, fields){

							if(err){
								console.log(err);
								throw 'db error';
							}else{
								makeRequest();
								return
							}
							
						});

					});
					
					// let el = result['OAI-PMH'].GetRecord[0].record[0].metadata[0]['oai_dc:dc'][0];
					
					// console.log(el['dc:title'][0]);
					// console.log(el['dc:creator'][0]);
					// console.log(el['dc:date']);
					// console.log(el['dc:identifier']);
					// console.log(el['dc:relation']);
					
					// try{
						// titles.push(el['dc:title'][0]);
					// }catch(e){
						// titles.push(null);
					// }
					
					// try{
						// creators.push(el['dc:creator'][0]);
					// }catch(e){
						// creators.push(null);
					// }
						
					// try{
						// dates.push(el['dc:date']);
					// }catch(e){
						// dates.push(null);
					// }
					
					// try{
						// identifiers.push(el['dc:identifier']);
					// }catch(e){
						// identifiers.push(null);
					// }
					
					// try{
						// relations.push(el['dc:relation']);
					// }catch(e){
						// relations.push(null);
					// }
					
				});
				
				// if(i>=handles.length){
					// console.log(titles);
					// console.log(creators);
					// console.log(dates);
					// console.log(identifiers);
					// console.log(relations);
					// process.exit();
				// }
			  
			});
				
		}
				
	});
	
}

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    exit_signal = true;
});

makeRequest();