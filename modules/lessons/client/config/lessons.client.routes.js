'use strict';

//Setting up route
angular.module('lessons').config(['$stateProvider',
	function($stateProvider) {
		// Lessons state routing
		$stateProvider.
		state('lessons', {
			abstract: true,
			url: '/lessons',
			template: '<ui-view/>'
		}).
		state('lessons.list', {
			url: '',
			templateUrl: 'modules/lessons/views/list-lessons.client.view.html'
		}).
		state('lessons.create', {
			url: '/create',
			templateUrl: 'modules/lessons/views/create-lesson.client.view.html'
		}).
		state('lessons.view', {
			url: '/:lessonId',
			templateUrl: 'modules/lessons/views/view-lesson.client.view.html'
		}).
		state('lessons.edit', {
			url: '/:lessonId/edit',
			templateUrl: 'modules/lessons/views/edit-lesson.client.view.html'
		});
	}
]);