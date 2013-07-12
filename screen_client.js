

function loadDummy(selector){

	$('#dummy').load(selector, function(){
		displayEvents();
	});

}

function displayEvents(){


	$('#dummy .briefEventListing').each(function(i){
		var title = $(this).children( '.eventTitle' );
		var meta = $(this).children( '.eventMeta' );
		var eventDate = meta.text().trim().substring(0, 9);
		var label = getDateLabel(eventDate);
		var desc = '';
		if(checkWhen(eventDate) !== 'later'){
			desc = meta.text().trim().substring(9);
		}
		$('#eventContainer').append('<div class="evtItem"><h3>'+label+title.text()+'</h3><p>'+desc+'</p></div>');
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

function getDateLabel(str){

	var todayEl = '<a class="today">TÄNÄÄ</a>';
	var tomorrowEl = '<a class="tomorrow">HUAME</a>'; //TODO change class

	if(checkWhen(str) === 'today'){
		return todayEl;
	}
	else if(checkWhen(str) === 'tomorrow'){
		return tomorrowEl;
	}
	else{
		return '<a>'+str+'</a>';
	}

}

function checkWhen(dateStr){

	var dateArr = dateStr.substring(3).split('.');

	var today = new Date();
	var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

	// check if date is today
	if(today.getDate() == dateArr[0] && (today.getMonth()+1) == dateArr[1]){
		return "today";
	}
	// or tomorrow
	else if(tomorrow.getDate() == dateArr[0] && (tomorrow.getMonth()+1) == dateArr[1]){
		return "tomorrow";
	}
	else{
		return 'later';
	}
}

function loadClock(el){

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

	loadClock($('.clock'));
	var timeTimer = setInterval(function(){loadClock($('.clock'));}, 1000);

});





