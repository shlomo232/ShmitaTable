Shmita.app.factory('importFoods', function() {

//http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
// http://stackoverflow.com/questions/16514509/how-do-you-serve-a-file-for-download-with-angularjs-or-javascript
	function getCalendar () { // For now, English only
		var events=[];
		for (var i = 0; i < foodsImport.length; i++) {
			events.push(makeEvent(foodsImport[i].Kedusha, "Kedusha begins for: ", foodsImport.English));
			events.push(makeEvent(foodsImport[i].NoKedusha, "Kedusha ends for: ", foodsImport.English));
			events.push(makeEvent(foodsImport[i].Sefihin, "Sefihin begins for: ", foodsImport.English));
			events.push(makeEvent(foodsImport[i].NoSefihin, "Sefihin ends for: ", foodsImport.English));
			events.push(makeEvent(foodsImport[i].Biur, "Time to do biur for: ", foodsImport.English));
		}
//		filteredEvents=deDup(events); // delete multiple events on same day, while transferring text contents
		var calText="x";
		for (var i = 0; i < events.length; i++)
			calText=calText+events.text+"\n\n";
		return calText;
	}


	function makeEvent(date, intro, species) {
		var thisEvent = new Object();
		thisEvent.date=date;
		thisEvent.text=intro+species;
		return thisEvent;
	}

	function deDup(events) {
		var a = events.concat();
		for(var i=0; i<a.length; ++i) {
			for(var j=i+1; j<a.length; ++j) {
				if(a[i].date == a[j].date) {
					a[i].text=a[i].text+"\n\n"+a[j].text;
					a.splice(j--, 1);
				}
			}
		}
		return a;
	}


	function doImport () {
		var foodsImport = [];
		$http.get('./shmita.csv').then(function(result) {
			foodsImport = $.csv.toObjects(result.data);
			makeFoodDates();
			loadedFoodsDeferred.resolve()
		});
	}
	
	function makeFoodDates() {
		for (var i = 0; i < foodsImport.length; i++) {
			foodsImport[i].beginKedusha = utils.parseDate(foodsImport[i].Kedusha);
			foodsImport[i].endKedusha   = utils.parseDate(foodsImport[i].NoKedusha);
			foodsImport[i].beginSefihin = utils.parseDate(foodsImport[i].Sefihin);
			foodsImport[i].endSefihin   = utils.parseDate(foodsImport[i].NoSefihin);
			foodsImport[i].biur         = utils.parseDate(foodsImport[i].Biur);
		}
	}

	return {
		doImport : doImport
	}
});
			
