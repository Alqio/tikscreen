

function loadDummy(selector){

	$('#dummy').load(selector, function(){
		displayEvents();
	});

}

function displayEvents(){
	$('#dummy .briefEventListing').each(function(i){
		var title = $(this).children( '.eventTitle' );
		var meta = $(this).children( '.eventMeta' );
			$('#eventContainer').append('<div><h3>'+title.text()+'</h3></div><p>'+meta.text()+'</p>');
	});

}

function getSignups(){
	var signups = [];

	$('#dummy .briefSignupListing').each(function(){
		var title = $(this).children('.signupTitle').text();
		var amount = $(this).children('.signupMeta').text().trim().substring(17);
		var obj = {'title' : title, 'amount' : amount};
		signups.push(obj);
	});

	return signups;

}

function setClockAndDate(el){

	var raw = new Date();
	var mins = raw.getMinutes();
	var secs = raw.getSeconds();
	if(mins<10)
		mins = '0'+mins;
	if(secs<10)
		secs = '0'+secs;

	var time = raw.getHours() + ':' + mins + ':' + secs;

	var weekday=new Array(7);
	weekday[0]="Sunday";
	weekday[1]="Monday";
	weekday[2]="Tuesday";
	weekday[3]="Wednesday";
	weekday[4]="Thursday";
	weekday[5]="Friday";
	weekday[6]="Saturday";

	var wday = weekday[raw.getDay()];

	var date = raw.getDate() + '.' + (raw.getMonth() + 1) + '.';

	el.html('<h1>'+time+'</h1><h3>'+wday+' '+date+'</h3>');

}


$(document).ready(function(){

	var selector = './tapahtumat.html #pageWrapper';
	loadDummy(selector);

	setClockAndDate($('.clock'));
	var timeTimer = setInterval(function(){setClockAndDate($('.clock'));}, 1000);

});





