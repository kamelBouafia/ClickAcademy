'use strict';

//Students service used to communicate Students REST endpoints
angular.module('students').factory('Students', ['$resource',
	function($resource) {
		return $resource('api/lessons/:lessonId/api/levels/:levelId/api/students/:studentId', {
            lessonId: '@lessonId', levelId: '@levelId', studentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
