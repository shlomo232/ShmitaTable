Shmita.app.factory('language', function() {
	var currentLang = "English";
	function getLanguage() {
		return currentLang;
	}

	function setLanguage(lang) {
		currentLang = lang;
	}

	return {
		getLanguage : getLanguage,
		setLanguage : setLanguage
	}
});
			