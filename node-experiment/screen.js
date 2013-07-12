var jsdom = require('jsdom');
var fs = require('fs');
var jquery = 'http://code.jquery.com/jquery-2.0.2.min.js';

fetchAndParse('./tapahtumat.html');
//fetchAndParse('http://tietokilta.fi/tapahtumat');

function fetchAndParse(url){
	console.log('Fetching & parsing page');

	var pageToParse = fs.readFileSync(url).toString();
	var parsedData = '';

	jsdom.env(pageToParse, [jquery], function(err, page){
				page.$('.eventTitle a').each(function(i){
					parsedData += '<p>'+page.$(this).text()+'</p>';
			});
				writeResults(parsedData);
		}
	);
}


function writeResults(data){
	console.log('Writing parsed data');
	var pageToWrite = fs.readFileSync('./index.html').toString();

	jsdom.env(pageToWrite, [jquery], function(err, page){
				page.$('#results').html(data);
				var composedPage = page.$('html').html();
				launchServer(composedPage);
		}
	);

}

function launchServer(page){
	var restify = require('restify');
	var server = restify.createServer();

	server.get('/', function(request, response, next) {
		response.status(200);
		response.end('<html>'+page+'</html>');
		return next();
	});

	server.get('/custom.css', function(request, response, next) {
		var style = fs.readFileSync('./custom.css').toString();
		response.status(200);
		response.end(style);
		return next();
	});

	var PORT = 9000;
	console.log('Listening port', PORT);
	server.listen(PORT);
}






