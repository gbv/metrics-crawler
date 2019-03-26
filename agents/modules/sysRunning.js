var exports = module.exports = {};

var mysql = require('mysql');

exports.check = function(con, callback){
	
	var sql = "SELECT sysRunning FROM mb_sys";

	con.query(sql, null, function(err, results, fields){
		if(err){
			callback(null);
		}else{
			var res = results[0].sysRunning;
			if(res == 0){
				callback(false);
			}else if(res == 1){
				callback(true);
			}else{
				callback(null);
			}
		}
	});
	
}