'use strict';

//Levels service used to communicate Levels REST endpoints
angular.module('levels').factory('Levels', ['$resource',
	function($resource) {
		return $resource('api/lessons/:lessonId/api/levels/:levelId', {
            lessonId: '@lessonId', levelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
