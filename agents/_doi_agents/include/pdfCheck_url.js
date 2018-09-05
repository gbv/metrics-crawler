var pdfreader = require('pdfreader');
var http = require('http');
var https = require('https');
var fs = require('fs');
var process = require('process');

pdfCheck_url = function(url, tmp_path, checkString, callback_found, callback_notFound){

	var checkString_upper = checkString.toUpperCase();

	var loader;
	
	if(url.substr(0,5) == "https"){
	
		loader = https;
		
	}else{

		loader = http;
		
	}
	
	var file = fs.createWriteStream(tmp_path+"/tmp_pdf_"+process.pid+".pdf")

	.on('error', (e)=>{callback_notFound(e)});

	var request = loader.get(url, function(response) {
		
		var stream = response.pipe(file);

		stream.on('finish', function(){

			stream.end();

			var pdf_done = false;
			var found_doi = false;

			new pdfreader.PdfReader().parseFileItems(tmp_path+"/tmp_pdf_"+process.pid+".pdf", function(err, item){

				if(err){

					if(!pdf_done){
						pdf_done = true;
						callback_notFound("pdf error");
					 }

				}else if(!item){

					if(!pdf_done){

						pdf_done = true;

						if(found_doi){
							callback_found();
						}else{
							callback_notFound("doi not found");
						}

					}

				}else if(item.text){

					var txt_upper = item.text.toUpperCase();

					if(txt_upper.includes(checkString_upper)){
						found_doi = true;
					}

				}

			});

		});

		stream.on('error', function(){

			stream.end();
			callback_notFound("stream error");

		});

	}).on('error', function(){
		callback_notFound("request error");
	});

}

module.exports = pdfCheck_url;