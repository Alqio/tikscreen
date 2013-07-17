

function loadDummy(selector){

	$('#dummy').load(selector, function(){
		displayEvents();
	});

}

function displayEvents(){


	$('#dummy .briefEventListing').each(function(i){
		var titlerow = $(this).find( '.eventTitle' ).text().trim().split(' @ ');
		var meta = $(this).find( '.eventMeta' ).text().trim();
		var title = titlerow[0];
		var location = titlerow[1];
		var date = wdToEnglish(meta.substring(0, 9)); //ma xx.yy. -> Mon xx.yy.

		var hours = meta.substring(10, 19);
		if(hours.substring(0,3) === 'klo'){
			date += hours.substring(3);
		}

		var signup = '';
		var probe = $.grep(getSignups(), function(e){ return e.title === title; });
		if (probe.length == 1) {
			signup = ' <i class="icon-group"></i> '+probe[0].amount;
		}

		var desc = '';
		if(checkWhen(date) !== 'later'){
			title += ' ('+ checkWhen(date)+')';
			var time = 'All day';
			var descPart = meta.substring(9);
			if(date.length > 10){
				time = date.substring(10);
				descPart = meta.substring(19);
			}
			date = time;
			desc = '<p class="descrow">'+descPart+'</p>';
		}

		var tab = '<span class="wide-space"> </span>';
		var specs = '<i class="icon-time icon-large"></i> '+date+tab+
		' <i class="icon-map-marker icon-large"></i> '+location+tab+signup;

		$('#eventContainer').append('<div class="evtItem pure-g"><div class="pure-u-1"><h2>'+title+
			'</h2></div><div class="pure-u-1"><h3 class="specrow">'+
			specs+'</h3>'+desc+'</div></div>');
	});

}

function wdToEnglish(str){

	var fiEn = {'ma' : 'Mon',
				'ti' : 'Tue',
				'ke' : 'Wed',
				'to' : 'Thu',
				'pe' : 'Fri',
				'la' : 'Sat',
				'su' : 'Sun'};

	// var todayEl = '<div class="today label pure-u"><h2>TODAY</h2></div>';
	// var tomorrowEl = '<div class="tomorrow label pure-u"><h2>TOMORROW</h2></div>';

	return fiEn[str.substring(0,2)]+' '+str.substring(3);


}

function checkWhen(dateStr){

	var dateArr = dateStr.substring(4).split('.');

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

function getHours(str){
	return;
}

function getSignups(){
	var signups = [];

	$('#dummy .briefSignupListing').each(function(){
		var title = $(this).children('.signupTitle').text().trim();
		var amount = $(this).children('.signupMeta').text().trim().substring(17);
		var obj = {'title' : title, 'amount' : amount};
		signups.push(obj);
	});

	return signups;

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

	var selector = './tapahtumat3.html #pageWrapper';

	loadDummy(selector);
	loadClock($('.clock'));

	var timeTimer = setInterval(function(){loadClock($('.clock'));}, 1000);
	var contentTimer = setInterval(function(){location.reload();}, 10*60*1000);

});





