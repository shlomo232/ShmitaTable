Shmita.app.factory('species', function($http, $q, utils, CSV) {
	var language="English";
	
	// Functions

	var now = new Date();
	var loadedFoodsDeferred = $q.defer();

	var foodsImport = [];
	$http.get('./shmita.csv').then(function(result) {
		foodsImport = $.csv.toObjects(result.data);
		loadFoods();
		loadedFoodsDeferred.resolve()
		calendarStuff();
	});
	
	function loadFoods() {
		for (var i = 0; i < foodsImport.length; i++) {
			foodsImport[i].beginKedusha = utils.parseDate(foodsImport[i].Kedusha);
			foodsImport[i].endKedusha   = utils.parseDate(foodsImport[i].NoKedusha);
			foodsImport[i].beginSefihin = utils.parseDate(foodsImport[i].Sefihin);
			foodsImport[i].endSefihin   = utils.parseDate(foodsImport[i].NoSefihin);
			foodsImport[i].biur         = utils.parseDate(foodsImport[i].Biur);
		}
	}

	function leadingZero(value){
		if(value < 10){
			return "0" + value.toString();
		}
		return value.toString();    
	}
	function date8Digit(date) {
		str = date.getFullYear().toString();
		str = str + leadingZero(date.getMonth()+1);
		str = str + leadingZero(date.getDate());
		return str;
	}
	function dateForIcs(date) {
		str = date.getFullYear().toString();
		str = str + leadingZero(date.getMonth()+1);
		str = str + date.getDate().toString();
		str = str + "T" + date.getHours().toString();
		str = str + date.getMinutes().toString();
		str = str + date.getSeconds().toString() + "Z";
		return str;
	}

	function calendarStuff() {
		var events=[];
		var idCount=0;
		//Create event objects (5 per food): (food; event; date). (Exclude "none"s)
		for (var i = 0; i < foodsImport.length; i++) {
			if (foodsImport[i].KedushaEn != "None")
				events.push( {
					food : foodsImport[i].English,
					event :  "Begin kedushat shviit",
					date : foodsImport[i].beginKedusha,
					id : idCount } );
			if (foodsImport[i].NoKedushaEn != "None")
				events.push( {
					food : foodsImport[i].English,
					event :  "End kedushat shviit",
					date : foodsImport[i].endKedusha,
					id : idCount } );
			if (foodsImport[i].SefihinEn != "None")
				events.push( {
					food : foodsImport[i].English,
					event :  "Begin sefihin",
					date : foodsImport[i].beginSefihin,
					id : idCount } );
			if (foodsImport[i].NoSefihinEn != "None")
				events.push( {
					food : foodsImport[i].English,
					event :  "End sefihin",
					date : foodsImport[i].endSefihin,
					id : idCount } );
			if (foodsImport[i].BiurEn != "None")
				events.push( {
					food : foodsImport[i].English,
					event :  "Begin biur",
					date : foodsImport[i].biur,
					id : idCount } );
			idCount++;
		} 
/*
		//Sort event objects by date, then event, then food (https://github.com/Teun/thenBy.js)
		firstBy=(function(){function e(f){f.thenBy=t;return f}
				function t(y,x){x=this;return e(function(a,b){return x(a,b)||y(a,b)})}return e})();
			// Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0

		events.sort(
			firstBy(function (v1, v2) { return v1.date - v2.date; })
			.thenBy(function (v1, v2) { return v1.event - v2.event; })
			.thenBy(function (v1, v2) { return v1.food - v2.food; })
		);
*/
		events.sort(function (v1, v2) { return v1.date - v2.date; });

		//Merge event objects
		for (var i = 0; i < events.length; i++) {
			for (var j = 0; j < events.length; j++) {
				if (i!=j && events[j].event!="Junk"
						&& events[i].date.getTime()===events[j].date.getTime()
						&& events[i].event===events[j].event) {
//					alert(i+" "+j+" "+events[i].event+" "+events[i].food+", "+events[j].food);
					events[i].food = events[i].food + "\, " + events[j].food;
					events[j].event="Junk";
				}
			}
		}
		for (var i = events.length-1; i >=0 ; i--) {
			if (events[i].event=="Junk") {
	//			alert("Removing"+events[i].event+events[i].food+" "+events.length);
				events.splice(i,1); //Remove element
			}
		}

		//Export as ics file
		calText="";
		calText = calText + "BEGIN:VCALENDAR\r\n";
		calText = calText + "VERSION:2.0\r\n";
		calText = calText + "PRODID:ShmitaTable\r\n";
		for (var i = 0; i < events.length; i++) {
			calText = calText + "BEGIN:VEVENT\r\n"
			+ "UID:" + events[i].event.replace(/[ ,]/g,'')
				+ events[i].food.replace(/[ ,]/g,'') + "@shmitatable.com\r\n"
			+ "DTSTAMP:" + dateForIcs(new Date()) + "\r\n"
			+ "DTSTART;VALUE=DATE:" + date8Digit(events[i].date) + "\r\n"
			+ "DTEND;VALUE=DATE:" + date8Digit(new Date(events[i].date.getTime()+86400000)) + "\r\n"
			+ "SUMMARY:Shmita Table: " + events[i].event.replace(/,/g,'\\,') + " for " + events[i].food.replace(/,/g,'\\,') + "\r\n"
//			+ "DESCRIPTION:" + events[i].event + " for " + events[i].food.replace(/,/g,'\\,') + "\r\n"
			+ "END:VEVENT\r\n";
		} 
		calText = calText + "END:VCALENDAR\r\n";
		var blob = new Blob([calText], {    type: "text/plain;charset=utf-8;", });
		saveAs(blob, "thing.ics");
		return calText;
	}

	function getList(listFunc) {
		var listDeferred = $q.defer();
		var list = [];
		loadedFoodsDeferred.promise.then(function(){
/*			listFunc = listFuncs[listFunc];
			for (var i = 0; i < foodsImport.length; i++) {
		//		if (listFunc(foodsImport[i])) {
					list.push(foodsImport[i]);
		//		}
			}*/
			list=foodsImport;
			listDeferred.resolve(list); 
		});
		return listDeferred.promise;
	}

	return {
		getList : getList 
	}
});
