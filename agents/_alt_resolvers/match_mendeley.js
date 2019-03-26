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

var ids = [];

var running = false;

var exit_signal = false;

var sql = "SELECT metadata_econStor.id FROM metadata_econStor LEFT JOIN works_alt ON metadata_econStor.work_alt_id = works_alt.id WHERE data is not null and catalog_mendeley is not null and mendeley_match_tried = 0 limit 17500;";

con.query(sql, function(err, results, fields){
	
	if(err){
		console.log(err);
		throw 'mysql err'
	}
	
	for(let el of results){
		ids.push(el.id);
	}
	
	console.log("ids ready");
	setInterval(checkAndRun, 2);
	
});

function saveWork(work_alt_id, mendeley_id, meta_mendeley, match_type){

	if(!mendeley_id){
		
		var sql_0 = "UPDATE works_alt SET mendeley_match_tried = 1 WHERE id = ?";
		
		con.query(sql_0, [work_alt_id], function(err, results, fields){
			if(err){
				console.log(err);
				throw 'mysql error'
			}
		});
		
		return
	}
	
	var sql = "UPDATE works_alt SET mendeley_match_tried = 1, mendeley_id_guess = ? WHERE id = ?";
	
	con.query(sql, [mendeley_id, work_alt_id], function(err, results, fields){
		
		if(err){
			console.log(err);
			throw 'mysql error'
		}
		
		sql = "UPDATE metadata_econStor SET mendeley_match_type = ?, work_mendeley = ? WHERE work_alt_id = ?";
		
		con.query(sql, [match_type, meta_mendeley, work_alt_id], function(err, results, fields){
			if(err){
				console.log(err);
				throw 'mysql error'
			}
		});
		
	});
		
	return
	
}

function checkAndRun(){
	
	if(running){
		return
	}else{
		running = true;
	}
	
	if(exit_signal){
		process.exit();
		return
	}
	
	if(ids.length == 0){
		console.log("no more ids");
		process.exit();
	}
	
	var id = ids[ids.length-1];
	
	sql = "SELECT work_alt_id, data, catalog_mendeley FROM metadata_econStor WHERE id = ?";
	
	con.query(sql, [id], function(err, results, fields){
		
		let work_alt_id = results[0].work_alt_id;
		let data = JSON.parse(results[0].data);
		let catalog_mendeley = JSON.parse(results[0].catalog_mendeley);
		
		let meta = data['OAI-PMH'].GetRecord[0].record[0].metadata[0]['oai_dc:dc'][0];
		let title = meta['dc:title'][0];
		let authors = meta['dc:creator'][0];
		let author = authors.split(' ')[0].split(',')[0];
		
		let date = meta['dc:date'];
		
		if(!(catalog_mendeley instanceof Array) || catalog_mendeley.length == 0){
			saveWork(work_alt_id, null);
			ids.splice(ids.length-1,1);
			running = false;
			return
		}
		
		for(let el of catalog_mendeley){
			let mendeley_id = el.id;
			let _title = el.title;
			let _date = el.year;
			let _authors = el.authors;
			
			let _authors_surnames = [];
			
			if(_authors instanceof Array){
				for(let author of _authors){
					_authors_surnames.push(author.last_name);
				}
				if(!_authors_surnames.includes(author)){
					saveWork(work_alt_id, null);
					continue
				}
			}else{
				saveWork(work_alt_id, null);
				continue
			}
			
			if(!date.includes(String(_date))){
				saveWork(work_alt_id, null);
				continue
			}
			
			if(title.length < 10 || _title.length < 10){
				saveWork(work_alt_id, null);
				continue
			}
			
			let meta_mendeley = JSON.stringify(el);
			
			if(title == _title){
				// console.log("");
				// console.log("==== TITLE PERFECT ====");
				// console.log(title);
				// console.log(_title);
				// console.log(mendeley_id);
				saveWork(work_alt_id, mendeley_id, meta_mendeley, "title perfect");
				break
			}
			
			// Punctuation regex from user 'Mike Grace' @ https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
			let title_mod = title.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s{2,}/g, ' ').replace(/[^a-z0-9\s]/g, '_');
			let _title_mod = _title.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s{2,}/g, ' ').replace(/[^a-z0-9\s]/g, '_');
			
			if(title_mod == _title_mod){
				saveWork(work_alt_id, mendeley_id, meta_mendeley, "title mod");
				// console.log("");
				// console.log("==== TITLE MOD ====");
				// console.log(title);
				// console.log(_title);
				// console.log(title_mod);
				// console.log(_title_mod);
				break
			}
			
			let title_split = title_mod.split(' ');
			let _title_split = _title_mod.split(' ');

			title_split = title_split.filter(function(element){
				return element.length > 3
			});
			
			_title_split = _title_split.filter(function(element){
				return element.length > 3
			});
			
			if(title_split.length < 3 || _title_split.length < 5){
				saveWork(work_alt_id, null);
				continue
			}
			
			let word_matches = 0;
			
			let longer, shorter;
			
			if(title_split.length > _title_split.length){
				longer = title_split;
				shorter = _title_split;
			}else{
				longer = _title_split;
				shorter = title_split;
			}
			
			for(let word of longer){
				if(shorter.includes(word)){
					word_matches += 1;
				}
			}
			
			if(word_matches/longer.length >= .85){
				// console.log("");
				// console.log("==== TITLE PARTIAL ====");
				// console.log(title);
				// console.log(_title);
				// console.log(title_mod);
				// console.log(_title_mod);
				// console.log("Word matches: "+word_matches+"/"+title_split.length);
				saveWork(work_alt_id, mendeley_id, meta_mendeley, "title partial");
				break
			}
			
			saveWork(work_alt_id, null);
			
			
		}
		
		ids.splice(ids.length-1,1);
		running = false;
		
	});
	
}

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    exit_signal = true;
});