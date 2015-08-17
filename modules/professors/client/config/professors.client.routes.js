'use strict';

//Setting up route
angular.module('professors').config(['$stateProvider',
	function($stateProvider) {
		// Professors state routing
		$stateProvider.
		state('professors', {
			abstract: true,
			url: '/professors',
			template: '<ui-view/>'
		}).
		state('professors.list', {
			url: '',
			templateUrl: 'modules/professors/views/list-professors.client.view.html'
		}).
		state('professors.create', {
			url: '/create',
			templateUrl: 'modules/professors/views/create-professor.client.view.html'
		}).
		state('professors.view', {
			url: '/:professorId',
			templateUrl: 'modules/professors/views/view-professor.client.view.html'
		}).
		state('professors.edit', {
			url: '/:professorId/edit',
			templateUrl: 'modules/professors/views/edit-professor.client.view.html'
		});
	}
]);