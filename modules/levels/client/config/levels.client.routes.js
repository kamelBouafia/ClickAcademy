'use strict';

//Setting up route
angular.module('levels').config(['$stateProvider',
	function($stateProvider) {
		// Levels state routing
		$stateProvider.
		state('levels', {
			abstract: true,
			url: '/levels',
			template: '<ui-view/>'
		}).
		state('levels.list', {
			url: '',
			templateUrl: 'modules/levels/views/list-levels.client.view.html'
		}).
		state('levels.create', {
			url: '/create',
			templateUrl: 'modules/levels/views/create-level.client.view.html'
		}).
		state('levels.view', {
			url: '/:levelId',
			templateUrl: 'modules/levels/views/view-level.client.view.html'
		}).
		state('levels.edit', {
			url: '/:levelId/edit',
			templateUrl: 'modules/levels/views/edit-level.client.view.html'
		});
	}
]);