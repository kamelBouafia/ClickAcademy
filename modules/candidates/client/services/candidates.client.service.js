'use strict';

//Candidates service used to communicate Candidates REST endpoints
angular.module('candidates').factory('Candidates', ['$resource',
	function($resource) {
		return $resource('api/lessons/:lessonId/api/levels/:levelId/api/candidates/:candidateId', {
            lessonId: '@lessonId', levelId: '@levelId', candidateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
