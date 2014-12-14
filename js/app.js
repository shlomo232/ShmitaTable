Shmita = {};
Shmita.app = angular.module('ShmitaApp', ['ngRoute']);

Shmita.app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'pages/home.html'
		})
		.when('/species', {
			templateUrl : 'pages/species.html'
		})
		.when('/status/:status', {
			templateUrl : 'pages/status.html',
			controller : 'StatusController'
		})
		.when('/calendar', {
			templateUrl : 'pages/calendar.html',
		})
		.when('/status', {
			redirectTo : '/status/kedusha',
		});
});