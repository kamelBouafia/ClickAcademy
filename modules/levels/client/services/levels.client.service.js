'use strict';

//Levels service used to communicate Levels REST endpoints
angular.module('levels').factory('Levels', ['$resource',
	function($resource) {
		return $resource('api/levels/:levelId', { levelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);