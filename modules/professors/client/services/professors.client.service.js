'use strict';

//Professors service used to communicate Professors REST endpoints
angular.module('professors').factory('Professors', ['$resource','$rootScope',
	function($resource,$rootScope) {
		return $resource('api/professors/:professorId', { professorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
