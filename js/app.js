Shmita = {};
Shmita.app = angular.module('ShmitaApp', ['ngRoute']);

Shmita.app.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|javascript):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);

Shmita.app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'pages/home.html'
		})
		.when('/species', {
			templateUrl : 'pages/species.html',
			controller : 'SpeciesController'
		})
		.when('/status/:status', {
			templateUrl : 'pages/status.html',
			controller : 'StatusController'
		})
		.when('/status', {
			redirectTo : '/status/kedusha',
		})
		.when('/calendar', {
			templateUrl : 'pages/calendar.html',
			controller : 'CalendarController'
		});
});
