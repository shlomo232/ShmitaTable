Shmita = {};
Shmita.app = angular.module('ShmitaApp', ['ngRoute']);

Shmita.app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'pages/home.html'
		})
		.when('/species', {
			redirectTo : 'pages/species.html',
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
		});
});
