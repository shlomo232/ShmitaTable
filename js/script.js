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
			English: 'עברית',
			Hebrew: 'English'
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
