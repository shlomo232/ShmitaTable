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
	function getList(listFunc) {
		var listDeferred = $q.defer();
		var list = [];
		loadedFoodsDeferred.promise.then(function(){
//			listFunc = listFuncs[listFunc];
			for (var i = 0; i < foodsImport.length; i++) {
		//		if (listFunc(foodsImport[i])) {
					list.push(foodsImport[i]);
		//		}
			}
			listDeferred.resolve(list);
		});
		return listDeferred.promise;
	}

	return {
		getList : getList 
	}
});
