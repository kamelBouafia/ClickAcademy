'use strict';

//Professors service used to communicate Professors REST endpoints
angular.module('professors').factory('Professors', ['$resource',
	function($resource) {
		return $resource('api/professors/:professorId', { professorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);