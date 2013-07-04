

function fetchAndParse(url){
	console.log('Fetching & parsing page');

$('#results').load(url, function(){
});


}

$(document).ready(function(){

	var url = './tapahtumat.html #pageWrapper';
	fetchAndParse(url);

});





