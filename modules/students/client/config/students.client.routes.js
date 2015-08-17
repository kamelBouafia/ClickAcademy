'use strict';

//Setting up route
angular.module('students').config(['$stateProvider',
	function($stateProvider) {
		// Students state routing
		$stateProvider.
		state('students', {
			abstract: true,
			url: '/students',
			template: '<ui-view/>'
		}).
		state('students.list', {
			url: '',
			templateUrl: 'modules/students/views/list-students.client.view.html'
		}).
		state('students.create', {
			url: '/create',
			templateUrl: 'modules/students/views/create-student.client.view.html'
		}).
		state('students.view', {
			url: '/:studentId',
			templateUrl: 'modules/students/views/view-student.client.view.html'
		}).
		state('students.edit', {
			url: '/:studentId/edit',
			templateUrl: 'modules/students/views/edit-student.client.view.html'
		});
	}
]);