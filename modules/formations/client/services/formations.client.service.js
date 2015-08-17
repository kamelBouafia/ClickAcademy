'use strict';

//Formations service used to communicate Formations REST endpoints
angular.module('formations').factory('Formations', ['$resource',
	function($resource) {
		return $resource('api/formations/:formationId', { formationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);