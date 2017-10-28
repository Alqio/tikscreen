
//Define some time intervals
var INTERVAL_SEC = 1000; 				//one-second interval
var INTERVAL_MIN = 60 * 1000; 			//one-minute interval
var INTERVAL_HOUR = 60 * INTERVAL_MIN; 	//one-hour interval

//To prevent weird behavior, reload the whole page every now and then
var pageReloadTimer = setInterval(function(){location.reload();}, 6 * INTERVAL_HOUR);


// "MAIN"
$(document).ready(function(){

	//API URLs
	var WEATHER_URL = 'http://outside.aalto.fi/data.txt';
	var SODEXO_BASE = 'http://www.sodexo.fi/ruokalistat/output/daily_json/142/';
	var SODEXO_URL = getFullSodexoUrl(SODEXO_BASE);
	var ALVARI_URL = 'http://www.amica.fi/modules/json/json/Index?costNumber=0190&language=fi';
	var DIPOLI_URL = 'http://www.fazerfoodco.fi/modules/json/json/Index?costNumber=3101&language=fi'
	var HSL_URL = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
	var TIK_EVENT_URL = 'http://tietokilta.fi/tapahtumat #pageWrapper'; //note the selector

	// START CLOCK
	loadClock();
	var clockTimer = setInterval(function(){ loadClock(); }, INTERVAL_SEC);

	// OUTSIDE TEMPERATURE
	loadWeather(WEATHER_URL);
	var weatherTimer = setInterval(function() { loadWeather(WEATHER_URL); }, INTERVAL_MIN * 10);

	// SODEXO TODAY'S MENU
	loadMenu();
	setInterval(function() { loadMenu(); }, INTERVAL_MIN * 15);
	
	// BUS STOPS
	loadBusStops(HSL_URL);
	var busTimer = setInterval(function(){ loadBusStops(HSL_URL); }, INTERVAL_MIN);

	// TIETOKILTA EVENTS 
	loadEvents(TIK_EVENT_URL);
	var eventTimer = setInterval(function(){ loadEvents(TIK_EVENT_URL); }, INTERVAL_HOUR);

});

//construct today's sodexo url
function getFullSodexoUrl(base){
	var d = new Date();
	var y = d.getFullYear();
	var m = d.getMonth() + 1;
	var day = d.getDate();
	return base + y+'/'+m+'/'+day+'/fi';
}


/*
	CLOCK & DATE
*/
function loadClock(){
	var clock = new Date();
	var hours = clock.getHours();
	var mins = clock.getMinutes();
	if(mins<10)
		mins = '0'+mins;

	var time = hours + ':' + mins;

	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

	var wday = weekday[clock.getDay()];

	var date = clock.getDate() + '.' + (clock.getMonth() + 1) + '.';
	$('#clockDisp').text(time);
	$('#dateDisp').text(wday+' '+date);
}


/*
	OUTSIDE TEMPERATURE
*/
function loadWeather(url){
	$.get(url, function(raw) {
		var data = JSON.parse(raw);
		$('#weather').text(Math.round(data["gent-outside-t"]) + ' °C');
	});
}


/*
	SODEXO & SUBWAY MENUS
*/
function loadMenu(){
	var clock = new Date();
	var hours = clock.getHours();
	var mins = clock.getMinutes();

	var wday = clock.getDay();

	if (hours < 14 && wday < 6){
		$('#RestourantName').text("SODEXO");
		loadSodexo(SODEXO_URL);
	}
	else if (hours <= 17  && mins < 15 && wday < 6){
		$('#RestourantName').text("ALVARI");
		loadAlvariDipoli(ALVARI_URL);
	}
	else if ( (hours < 19 && wday < 6) || (hours < 15) ){
		$('#RestourantName').text("DIPOLI");
		loadAlvariDipoli(DIPOLI_URL);
	}
	$('#RestourantName').text("NO OPEN RESTAURANTS ;-;");
	console.log("none")
}
function loadSodexo(sodexo_url){
	$.get(sodexo_url, function(data){
		for(var i=0; i < data.courses.length; i++){
			var entry =  '<div class="sodexoItem">';
			entry += '<h4>'+data.courses[i].title_fi+'</h4>';
			if(data.courses[i].title_fi !== data.courses[i].title_en)
				entry += '<h4>'+data.courses[i].title_en+'</h4>';
			entry += '</div>';
			$('#sodexoContainer').append(entry);
		}
	});
}
function loadAlvariDipoli(food_url){
	$.get(food_url, function(data){
		for(var i=0; i < data.menusfordays[0].setMenus.length; i++){
			for(var j=0; j < data.menusfordays[0].setMenus[i].Components.length; j++){
				var entry =  '<div class="sodexoItem">';
				entry += '<h4>'+data.menusfordays[0].setMenus[i].Components[j]+'</h4>';
				entry += '</div>';
				$('#sodexoContainer').append(entry);
			}
		}
	});
}


/*
	BUS STOPS
*/
function loadBusStops(hsl_url){

	var ndeps = 5; //departure times per stop
	var s10 = 'HSL:2222235'; //Alvar Aallon puisto, Laituri 10 (Helsinkiin)
	var s11 = 'HSL:2222211'; //Alvar Aallon puisto, Laituri 11 (Helsingistä)
	var s12 = 'HSL:2222212'; //Kemisti, Laituri 12
	var s13 = 'HSL:2222234'; //Kemisti, Laituri 13

	var departures = [];

	//Fetch & parse stoptimes from HSL, then sort departures and display
	$.when(fetchStop(s10), fetchStop(s11), fetchStop(s12), fetchStop(s13)).done(function(d1,d2,d3,d4){

	    parseStopData(d1[0].data);
	    parseStopData(d2[0].data);
	    parseStopData(d3[0].data);
	    parseStopData(d4[0].data);

	    departures.sort(function (depA, depB){
			return depA.scheduledArrival - depB.scheduledArrival;
		});

	    displayStopTimes(departures);
	   
	});

	function fetchStop(stopCode){
		var query = '{ stop(id: "'+stopCode+'"){ platformCode '
			+'stoptimesWithoutPatterns(numberOfDepartures:'+ndeps+'){ '
			+'scheduledArrival trip{ tripHeadsign route{shortName} }}'
			+'}}';

		var deferred = $.ajax({
			url: hsl_url,
			headers: {"Content-Type":"application/graphql"},
			method: "POST", 
			data: query
		});
		return deferred;
	}

	function parseStopData(data){
		if(!data.stop) 
			return;
		for(var i = 0; i < data.stop.stoptimesWithoutPatterns.length; i++){
			var depData = data.stop.stoptimesWithoutPatterns[i];
				depData["platform"] = data.stop.platformCode;
				departures.push(depData);
			}
	}

	function displayStopTimes(deps){
		$('.busrow').remove();
		for(var i = 0; i < deps.length; i++){
			var row = '<tr class="busrow">'
					+'<td><b>'+convertSecondsToClock(deps[i].scheduledArrival)+'</b></td>'
					+'<td><b>'+deps[i].trip.route.shortName+'</b></td>'
					+'<td>'+deps[i].trip.tripHeadsign+'</td>'
					+'<td>'+deps[i].platform+'</td>'
					+ '</tr>';
			$('#busTimes').append(row);
		}
	}

}


function convertSecondsToClock(s){
	var h = (s / 3600) % 24 | 0;
	var m = (s % 3600) / 60 | 0;
	if(h<10)
		h = '0' + h;
	if(m<10)
		m = '0' + m;
	return h+':'+m;
}


/*
	GUILD EVENTS
*/
function loadEvents(event_url){
	$('#eventdummy').load(event_url, function(){
		displayEvents();
	});
}
function displayEvents(){

	var eventItems = '';

	$('#eventdummy .briefEventListing').each(function(i){
		var titlerow = $(this).find('.eventTitle').text().trim().split(' @ ');
		var meta = $(this).find('.eventMeta').text().trim();
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
			signup = ' <i class="fa fa-user"></i> '+probe[0].amount;
		}

		var desc = '';
		var label = getLabel(date);
		
		if(label !== 'later'){ //show desc if today or tommorow
			var time = 'All day';
			var descPart = meta.substring(9);
			if(date.length > 10){
				time = date.substring(10);
				descPart = meta.substring(19);
			}
			date = label + ' ' + time;
			desc = '<p class="descrow">'+descPart+'</p>';
		}

		var tab = '<span class="wide-space"></span>';
		var specs = '<i class="fa fa-clock-o"></i> '+date+tab+
		' <i class="fa fa-map-marker"></i> '+location+tab+signup;

		eventItems += '<div class="evtItem pure-g"><div class="pure-u-1"><h2>	'+title+
			'</h2></div><div class="pure-u-1"><h3 class="specrow">'+
			specs+'</h3>'+desc+'</div></div>';
	});

	$('#eventContainer').html(eventItems);

	function wdToEnglish(str){
	var fiEn = { 'ma' : 'Mon',
			'ti' : 'Tue',
			'ke' : 'Wed',
			'to' : 'Thu',
			'pe' : 'Fri',
			'la' : 'Sat',
			'su' : 'Sun' };
	return fiEn[str.substring(0,2)]+' '+str.substring(3);
	}

	function getLabel(dateStr){
		var now = new Date();
		var dateArr = dateStr.substring(4).split('.');
		var tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

		// check if date is today
		if(now.getDate() == dateArr[0] && (now.getMonth()+1) == dateArr[1]){
			return '<b>TODAY</b>';
		}
		// or tomorrow
		else if(tomorrow.getDate() == dateArr[0] && (tomorrow.getMonth()+1) == dateArr[1]){
			return '<b>TOMORROW</b>';
		}
		else {
			return 'later';
		}
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

}

