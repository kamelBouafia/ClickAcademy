'use strict';

//Setting up route
angular.module('formations').config(['$stateProvider',
	function($stateProvider) {
		// Formations state routing
		$stateProvider.
		state('formations', {
			abstract: true,
			url: '/formations',
			template: '<ui-view/>'
		}).
		state('formations.list', {
			url: '',
			templateUrl: 'modules/formations/views/list-formations.client.view.html'
		}).
		state('formations.create', {
			url: '/create',
			templateUrl: 'modules/formations/views/create-formation.client.view.html'
		}).
		state('formations.view', {
			url: '/:formationId',
			templateUrl: 'modules/formations/views/view-formation.client.view.html'
		}).
		state('formations.edit', {
			url: '/:formationId/edit',
			templateUrl: 'modules/formations/views/edit-formation.client.view.html'
		});
	}
]);