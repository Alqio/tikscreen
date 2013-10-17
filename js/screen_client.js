var date_global = new Date();
var hours_global = date_global.getHours();
var minutes_global = date_global.getMinutes();

function displayEvents(){
	$('#eventdummy .briefEventListing').each(function(i){
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
		if(getLabel(date) !== 'later'){
			title += getLabel(date);
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

		$('#eventContainer').append('<div class="evtItem pure-g"><div class="pure-u-1"><h2>	'+tab+tab+title+
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

	return fiEn[str.substring(0,2)]+' '+str.substring(3);
}

function getLabel(dateStr){
	var dateArr = dateStr.substring(4).split('.');
	var tomorrow = new Date(date_global.getTime() + 24 * 60 * 60 * 1000);

	// check if date is today
	if(date_global.getDate() == dateArr[0] && (date_global.getMonth()+1) == dateArr[1]){
		return '<div class="labeltag today">TODAY</div>';
	}
	// or tomorrow
	else if(tomorrow.getDate() == dateArr[0] && (tomorrow.getMonth()+1) == dateArr[1]){
		return '<div class="labeltag tomorrow">TOMORROW</div>';
	}
	else {
		return 'later';
	}
}

function getHours(str){
	return;
}

function getSignups(){
	var signups = [];

	$('#eventdummy .briefSignupListing').each(function(){
		var title = $(this).children('.signupTitle').text().trim();
		var amount = $(this).children('.signupMeta').text().trim().substring(17);
		var obj = {'title' : title, 'amount' : amount};
		signups.push(obj);
	});

	return signups;

}

function loadClock(el){
	var clock = new Date();
	var hours = clock.getHours();
	var mins = clock.getMinutes();
	if(mins<10)
		mins = '0'+mins;

	var time = hours + ':' + mins;

	var weekday=new Array(7);
	weekday[0]="Sunday";
	weekday[1]="Monday";
	weekday[2]="Tuesday";
	weekday[3]="Wednesday";
	weekday[4]="Thursday";
	weekday[5]="Friday";
	weekday[6]="Saturday";

	var wday = weekday[clock.getDay()];

	var date = clock.getDate() + '.' + (clock.getMonth() + 1) + '.';
	$('.clock').html('<h1>'+time+'</h1><h3>'+wday+' '+date+'</h3>');
}

function displayBusStops(source){
	var $target = $('#nwBusInfo');
	if(source == '#busdummy2')
		$target = $('#seBusInfo');

	var times = [];

	$(source).find('.stop_hour').each(function(i){
		if ($(this).text() == hours_global){ //select current hour
					var minuterow = $(this).next();
					minuterow.find('.stop_small_min').each(function(i){
						if($(this).text() >= minutes_global){
							var minsLeft = parseInt($(this).text(), 10) - minutes_global;
							var row = '<tr>';
							row += '<td>'+ minsLeft +'</td>'+'<td>'+ $(this).next().text().substring(1)+'</td>';
							row += '</tr>';
							times.push(row);
						}
					});
		}
		else{ //next hours

			var diff = parseInt($(this).text(), 10) - hours_global;
			if(diff > 0){
				var minuterow_ = $(this).next();
				minuterow_.find('.stop_small_min').each(function(i){
					var minsLeft = parseInt($(this).text(), 10) + (diff*60 - minutes_global);
					var row = '<tr>';
					row += '<td>'+ minsLeft +'</td>'+'<td>'+ $(this).next().text().substring(1)+'</td>';
					row += '</tr>';
					times.push(row);
				});

			}

		}
	});

	var showableTimes = 8;
	var timetable = '<table>';

	if(times.length === 0){
		timetable += '<tr><td>No more buses today :(</td></tr>';
	}
	else{
		timetable += '<tr><td><u>MIN</u></td><td><u>LINE</u></td></tr>';
	}

	for (i = 0; i < showableTimes; i++) {
		if(i >= times.length)
			break;
		timetable += times[i];
	}

	timetable += '</table>';

	$target.html(timetable);
}

function loadBusStops(dummyEl, dirPage){
	var currentWeekday = new Date(new Date().getTime() - 2 * 60 * 60 * 1000 ).getDay();

	if(currentWeekday === 0){ //sunday
		$(dummyEl).load(dirPage + ' #table_sun', function(){
			displayBusStops(dummyEl);
		});
	}
	else if(currentWeekday === 6){ //saturday
		$(dummyEl).load(dirPage + ' #table_sat', function(){
			displayBusStops(dummyEl);
		});
	}
	else{ //weekdays
		$(dummyEl).load(dirPage + ' #table_monfri', function(){
			displayBusStops(dummyEl);
		});
	}
}

function displayNethack() {
	var nethack_log = $('#nethackdummy_log').text();
	var nethack_scores = $('#nethackdummy_rec').text();
	var title_1 = '<div class="nethacktitle"><p>NETHACK TOP 5<p></div>';
	var title_2 = '<div class="nethacktitle"><p>LAST 5 GAMES<p></div>';
	$('#nethackContainer').html(title_1+'<pre>'+nethack_scores+'</pre>'+title_2+'<pre>'+nethack_log+'</pre>');
}

$(document).ready(function(){
	$('#eventdummy').load('./raw/tapahtumat.html #pageWrapper', function(){
		displayEvents();
	});
	$('#nethackdummy_log').load('./raw/nethack_log.txt');
	$('#nethackdummy_rec').load('./raw/nethack_scores.txt', function() {
		displayNethack();
	});

	loadClock($('.clock'));
	loadBusStops('#busdummy1', './raw/konemies_nw.html');
	loadBusStops('#busdummy2', './raw/konemies_se.html');

	var clockTimer = setInterval(function(){
		loadClock($('.clock'));
	}, 1000);
	var busTimer = setInterval(function(){
		loadBusStops('#busdummy1', './raw/konemies_nw.html');
		loadBusStops('#busdummy2', './raw/konemies_se.html');
	}, 30000);
	var refreshTimer = setInterval(function(){location.reload();}, 600000);

});
