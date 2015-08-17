'use strict';

//Lessons service used to communicate Lessons REST endpoints
angular.module('lessons').factory('Lessons', ['$resource',
	function($resource) {
		return $resource('api/formations/:formationId/api/lessons/:lessonId', {
            formationId: '@formationId', lessonId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
