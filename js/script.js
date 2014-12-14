Shmita.app.directive('navClick', function() {
	return {
    	restrict: 'A',
		link: function($scope, element, attrs) {
			console.log(element);
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
			route: ''
		},
		{
			name: 'By Species',
			route: 'species'
		},
		{
			name: 'By Status',
			route: 'status'
		},
		{
			name: 'Calendar',
			route: 'calendar'
		}
	]

	$scope.menuOpen = false;

	$scope.toggleMenu = function() {
		$scope.menuOpen = !$scope.menuOpen;
	}

	$scope.getTranslation = function(textObject) {
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
			English: 'English',
			Hebrew: 'עברית'
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
});

Shmita.app.controller('StatusController', function($scope, $routeParams, status) {
	$scope.statusNav = [
		{
			name: 'Kedushat Shviit',
			route: 'kedusha'
		},
		{
			name: 'No Kedushat Shviit',
			route: 'noKedusha'
		},
		{
			name: 'Sefihin',
			route: 'sefihin'
		},
		{
			name: 'No Sefihin',
			route: 'noSefihin'
		},
		{
			name: 'Needs Biur',
			route: 'needsBiur'
		}
	]

	$scope.$watch($routeParams.status, switchTab);

	function switchTab() {
		console.log('status', $routeParams.status);
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