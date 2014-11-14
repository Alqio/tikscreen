//var date_global = new Date();
var vituttaa_amount = 0;

function displayEvents(){
	var temp_container = '';
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

		temp_container += '<div class="evtItem pure-g"><div class="pure-u-1"><h2>	'+title+
			'</h2></div><div class="pure-u-1"><h3 class="specrow">'+
			specs+'</h3>'+desc+'</div></div>';
	});
	$('#eventContainer').html(temp_container);
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
	var now = new Date();
	var dateArr = dateStr.substring(4).split('.');
	var tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

	// check if date is today
	if(now.getDate() == dateArr[0] && (now.getMonth()+1) == dateArr[1]){
		return '<div class="labeltag">TODAY</div>';
	}
	// or tomorrow
	else if(tomorrow.getDate() == dateArr[0] && (tomorrow.getMonth()+1) == dateArr[1]){
		return '<div class="labeltag">TOMORROW</div>';
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

function loadClock(){
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
	$('#clockDisp').text(time);
	$('#dateDisp').text(wday+' '+date);
}

function loadWeather(url){

	$.get(url, function(raw) {
		var data = JSON.parse(raw);
		$('#weather').text(Math.round(data["gent-outside-t"]) + ' °C');
	});


}

function cleanBusCode(long_code) {
	var short_code = long_code.slice(1).split(" ")[0];
	if ( short_code[0] == "0" ) {
		short_code = short_code.slice(1);
	}
	return short_code;
}

function cleanTimeCode(old_code){
	
	//TODO calculate remaining time instead of time of clock
	old_code = old_code.toString();
	
	if(old_code.length < 4)
		old_code = '0'+old_code;

	return old_code.substr(0, 2)%24 + ':' + old_code.substr(2);
}

function loadBusStops(api_account, api_password){
	var currentWeekday = new Date(new Date().getTime() - 2 * 60 * 60 * 1000 ).getDay();
	var id_konemies_se = "2222218";
	var id_konemies_nw = "2222222";
	var api_url = "http://api.reittiopas.fi/hsl/prod/?user="+api_account+"&pass="+api_password;
	callHSL(api_url, id_konemies_nw, "nw");
	callHSL(api_url, id_konemies_se, "se");
}

function callHSL(api_url, busstop_id, element_id) {
	var target = $("#seBusInfo");
	if (element_id == "nw")
		target = $("#nwBusInfo");

    var TIME_LIMIT = "240"; //max minutes to future
	var DEP_LIMIT = "10"; //max number of departures to fetch

	$.getJSON(api_url+"&request=stop&code="+busstop_id+"&time_limit="+TIME_LIMIT+"&dep_limit="+DEP_LIMIT, function(data) {
		var deps = data[0].departures;
		var times = [];
		var timetable = "<table>";
		$(deps).each(function( index ) {
			var buscode = cleanBusCode(this.code);
			var timecode = cleanTimeCode(this.time);
			var row = "<tr><td>" + timecode + "</td><td>" + buscode + "</td></tr>";
			times.push(row);
		});
		if (times.length == 0) {
			timetable += "<tr><td>No more buses today ;__;</td></tr>";
		}
		for (var i = 0; i < times.length; i++) {
			timetable += times[i];
		}
		target.html(timetable);
	});
}

function displayNethack() {
	var nethack_log = $('#nethackdummy_log').text();
	var nethack_scores = $('#nethackdummy_rec').text();
	var title_1 = '<div class="nethacktitle"><p>NETHACK TOP 5<p></div>';
	var title_2 = '<div class="nethacktitle"><p>LAST 5 GAMES<p></div>';
	$('#nethackContainer').html(title_1+'<pre>'+nethack_scores+'</pre>'+title_2+'<pre>'+nethack_log+'</pre>');
}

function displayVituttaa(init){

	$('#vituttaadummy').load(getVituttaaUrl(), function(){
		
		var msgs = $("#vituttaadummy a:contains('[Vituttaa]')");
		//check if there are new messages
		if (msgs.length == vituttaa_amount){
			$('#vituttaabulletin').hide();
			return;
		}
		//also abort if first update after page reload
		else if(init){ 
			vituttaa_amount = msgs.length;
			$('#vituttaabulletin').hide();
			return;
		}

		$('#vituttaabulletin').show();

		vituttaa_amount = msgs.length;

		var msglink = msgs.last().attr('href');
		var subj = msgs.last().text().split('[Vituttaa]')[1].trim();

		$('#vituttaadummy').load(getVituttaaUrl()+msglink, function(){
			var bod = $('#vituttaadummy pre').first().text();
			$('#vituttaa_msg').html('<h3>'+subj+'</h3><pre>'+bod+'</pre>');
		});

	});

}

function getVituttaaUrl(){

	var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
	var d = new Date();
    var y = d.getFullYear();
    var m = monthNames[d.getMonth()];

	var base = 'http://list.tietokilta.fi/pipermail/vituttaa/';
	var currentymonth = y+'-'+m+'/';

	return base+currentymonth;

}

function loadSodexo(url){

	$.get(url, function(data) {
		for(var i=0; i < data.courses.length; i++){
			var entry =  '<div class="sodexoItem">';
			entry += '<h2>'+data.courses[i].title_fi+'</h2>';
			entry += '<h2>'+data.courses[i].title_en+'</h2>';
			entry += '</div>'
			$('#sodexoContainer').append(entry);
		}

	});

}

function getSodexoUrl(){

	var base = 'http://www.sodexo.fi/ruokalistat/output/daily_json/142/';
	var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth() +1;
    var day = d.getDate();
    
    return base + y+'/'+m+'/'+day+'/fi';

}

function loadTikplay(url){

	//var npLabel = '<h3><i>NOW PLAYING</i></h3>';
	//var nextLabel = '<h3><i>NEXT UP</i></h3>';

	$.get(url, function(data) {

		var songArr = data.text;

		if(songArr.length === 0){
			$('#tikplay').hide();
		}
		else{
			$('#tikplay').show();
			//now playing
			$('#np_info').html('<b><pre></pre></b>');
			$('#np_info pre').text(songArr[0].artist + ' - ' +songArr[0].title);
			//more songs in queue
			if(songArr.length > 1){
				for(var i=1; i < songArr.length; i++){
					$('#np_info').append('<pre></pre>');
					var next = songArr[i].artist + ' - ' + songArr[i].title;
					$('#np_info pre').last().text(next);
				}
			}
		}

	});




}

$(document).ready(function(){
	
	loadClock();
	var clockTimer = setInterval(function(){
		loadClock();
	}, 1000);

	var INTERVAL_MIN = 60 * 1000; //one-minute interval
	var INTERVAL_HOUR = 60 * INTERVAL_MIN; //one-hour interval


	//BUS STOPS
	loadBusStops(hslaccount.username, hslaccount.passphrase);
	var busTimer = setInterval(function(){
		loadBusStops(hslaccount.username, hslaccount.passphrase);
	}, INTERVAL_MIN);

	//TIKPLAY QUEUE
	$('#tikplay').hide();
	var tikplay_url = 'http://tikradio.tt.hut.fi:5000/srv/v1.0/queue';
	loadTikplay(tikplay_url);
	var tikplayTimer = setInterval(function(){
		loadTikplay(tikplay_url);
	}, 10 * 1000); // every 10 seconds TODO: dynamically change this based on recent activity


	//SODEXO TODAY'S MENU
	var sodexo_url = getSodexoUrl();
	loadSodexo(sodexo_url);


	//NETHACK SCORES
/*
	var nethack_log_url = 'http://www.niksula.hut.fi/~lindhj1/nethack_log.txt';
	var nethack_scores_url = 'http://www.niksula.hut.fi/~lindhj1/nethack_scores.txt';
	$('#nethackdummy_log').load(nethack_log_url, function() {
		$('#nethackdummy_rec').load(nethack_scores_url, function () {
			displayNethack();
		});});
	var nethackTimer = setInterval(function() {
		$('#nethackdummy_log').load(nethack_log_url, function() {
			$('#nethackdummy_rec').load(nethack_scores_url, function () {
				displayNethack();
			});});
	}, INTERVAL_MIN * 15);
*/

	//OUTSIDE TEMPERATURE
	var weather_url = 'http://outside.aalto.fi/data.txt';
	loadWeather(weather_url);
	var weatherTimer = setInterval(function() {
		loadWeather(weather_url);
	}, INTERVAL_MIN * 5);


	//VITUTTAA MAILING LIST BULLETIN
	/*
	displayVituttaa(true);
	var vituttaaTimer = setInterval(function(){
		displayVituttaa(false);
	}, INTERVAL_MIN*15);
	*/


	//TIETOKILTA EVENTS
	var event_url = 'http://tietokilta.fi/tapahtumat #pageWrapper'; //note the selector
	$('#eventdummy').load(event_url, function(){
		displayEvents();
	});
	var eventTimer = setInterval(function() {
		$('#eventdummy').load(event_url, function(){
			displayEvents();
		});
	}, INTERVAL_HOUR);


	//To prevent weird behavior, reload the whole page every now and then
	var pageReloadTimer = setInterval(function(){location.reload();}, 6 * INTERVAL_HOUR);

});
