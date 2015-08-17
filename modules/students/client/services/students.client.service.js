'use strict';

//Students service used to communicate Students REST endpoints
angular.module('students').factory('Students', ['$resource',
	function($resource) {
		return $resource('api/students/:studentId', { studentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);