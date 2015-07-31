'use strict';

//Setting up route
angular.module('logs').config(['$stateProvider',
	function($stateProvider) {
		// Logs state routing
		$stateProvider.
		state('logs', {
			abstract: true,
			url: '/logs',
			template: '<ui-view/>'
		}).
		state('logs.list', {
			url: '',
			templateUrl: 'modules/logs/views/list-logs.client.view.html'
		}).
		state('logs.create', {
			url: '/create',
			templateUrl: 'modules/logs/views/create-log.client.view.html'
		}).
		state('logs.view', {
			url: '/:logId',
			templateUrl: 'modules/logs/views/view-log.client.view.html'
		}).
		state('logs.edit', {
			url: '/:logId/edit',
			templateUrl: 'modules/logs/views/edit-log.client.view.html'
		});
	}
]);