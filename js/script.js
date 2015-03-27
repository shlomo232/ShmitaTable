Shmita.app.directive('navClick', function() {
	return {
    	restrict: 'A',
		link: function($scope, element, attrs) {
//			console.log(element);
			element[0].addEventListener('click', function(ev) {
				console.log(ev.target.nodeName);
				if (ev.target.nodeName === 'NAV' || ev.target.nodeName === 'A') {
					$scope.toggleMenu();
					$scope.$apply();
				}
			});
		}
	};
});

Shmita.app.controller('MainController', function($scope, language) {
	$scope.nav = [
		{
			name: 'Home',
			English: 'Home',
			Hebrew: 'אודות',
			route: ''
		},
		{
			name: 'By Species',
			English: 'By Species',
			Hebrew: 'לפי שם',
			route: 'species'
		},
		{
			name: 'By Status',
			English: 'By Status',
			Hebrew: 'לפי סטטוס',
			route: 'status'
		},
		{
			name: 'Calendar',
			English: 'Calendar',
			Hebrew: 'יומן',
			route: 'calendar'
		}
	]

	$scope.menuOpen = false;

	$scope.toggleMenu = function() {
		$scope.menuOpen = !$scope.menuOpen;
	}

	$scope.getTranslation = function(textObject) {
//		alert(textObject.toSource());
		return textObject[language.getLanguage()];
	};

	$scope.switchLanguage = function() {
		var lang = language.getLanguage();
		if (lang === 'English') {
			lang = 'Hebrew';
		} else {
			lang = 'English';
		}
		$scope.setLanguage(lang);
	};

	$scope.setLanguage = function(lang) {
		$scope.language = lang;
		language.setLanguage(lang);
		localStorage.setItem('language', lang);
	}

	$scope.languageLabel = function() {
		var labels = {
			English: ' עבור לשפה העברית',
			Hebrew: 'Switch to English'
		}
		return labels[language.getLanguage()];
	};

	$scope.setLanguage(localStorage.getItem('language') || language.getLanguage());

	var now = $scope.now = new Date();
	$scope.nowHe = jd_to_hebrew(gregorian_to_jd(now.getFullYear(),now.getMonth()+1,now.getDate())); // in special array format
	$scope.recent = new Date(); // A number of days ago - anything whose status changed in last # days gets an 'updated' flag.
	$scope.recent.setTime(now.getTime()-3*24*60*60*1000);
	$scope.monthListEn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	$scope.monthListEnHe=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
	$scope.monthListHe=['Nisan','Iyar','Sivan','Tammuz','Av','Elul','Tishrei','Heshvan','Kislev','Tevet','Shvat','Adar','Adar II'];
	$scope.monthListHeHe=['ניסן','אייר','סיון','תמוז','אב','אלול','תשרי','חשון','כסלו','טבת','שבט','אדר','אדר ב'];

	$scope.dialogEn = function(food) {
		str="";
		str=str+"<b>"+food.English+"</b><br>";
		str=str+"<b>Type:</b> "+food.Type+"<br>";
		str=str+"<b>Kedusha from:</b> "+food.KedushaEn+"<br>";
		str=str+"<b>Kedusha until:</b> "+food.NoKedushaEn+"<br>";
		str=str+"<b>Sefihin from:</b> "+food.SefihinEn+"<br>";
		str=str+"<b>Sefihin until:</b> "+food.NoSefihinEn+"<br>";
		str=str+"<b>Zman Biur:</b> "+food.BiurEn+"<br>";
		vex.dialog.alert(str);
	}
	$scope.dialogHe = function(food) {
		str="<div style='direction: rtl;'>";
		str=str+"<b>"+food.Hebrew+"</b><br>";
		str=str+"<b>סוג:</b> "+food.Type+"<br>";
		str=str+"<b>קדושה מ:</b> "+food.KedushaHe+"<br>";
		str=str+"<b>קדושה עד:</b> "+food.NoKedushaHe+"<br>";
		str=str+"<b>ספיחין מ:</b> "+food.SefihinHe+"<br>";
		str=str+"<b>ספיחין עד:</b> "+food.NoSefihinHe+"<br>";
		str=str+"<b>זמן ביעור:</b> "+food.BiurHe+"<br>";
		str=str+"</div>";
		vex.dialog.alert(str);
	}
});

Shmita.app.controller('StatusController', function($scope, $routeParams, status) {
	$scope.statusNav = [
		{
			name: 'Kedushat Shviit',
			English: 'Kedushat Shviit',
			Hebrew: 'קדושת שביעית',
			route: 'kedusha'
		},
		{
			name: 'No Kedushat Shviit',
			English: 'No Kedushat Shviit',
			Hebrew: 'ללא קדושת שביעית',
			route: 'noKedusha'
		},
		{
			name: 'Sefihin',
			English: 'Sefihin',
			Hebrew: 'ספיחין',
			route: 'sefihin'
		},
		{
			name: 'No Sefihin',
			English: 'No Sefihin',
			Hebrew: 'ללא ספיחין',
			route: 'noSefihin'
		},
		{
			name: 'Needs Biur',
			English: 'Needs Biur',
			Hebrew: 'צריכים ביעור',
			route: 'needsBiur'
		}
	]

	$scope.$watch($routeParams.status, switchTab);

	function switchTab() {
//		console.log('status', $routeParams.status);
		$scope.statusNav.forEach(function(tab){
			var activeTab;
			if (tab.route === $routeParams.status) {
				tab.active = true;
			} else if (tab.active) {
				tab.active = false;		
			}
		});
		status.getList($routeParams.status).then(function(list) {
			$scope.foodList = list;
		});
	}
	switchTab();
});

Shmita.app.controller('SpeciesController', function($scope, $routeParams, species) {
	$scope.$watch($routeParams.species, initList);

	function initList() {
		species.getList($routeParams.species).then(function(list) {
			$scope.foodList = list;
		});
	}
	initList();
});

Shmita.app.controller('CalendarController', function($scope, $routeParams, calendar) {
	$scope.$watch($routeParams.calendar, initList);

	$scope.getCalendar=function() { calendar.getCalendar(); };

	function initList() {
		calendar.getList($routeParams.calendar).then(function(list) {
			$scope.foodList = list;
		});
	}
	initList();
});
