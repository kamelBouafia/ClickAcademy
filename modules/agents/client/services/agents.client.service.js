'use strict';

//Agents service used to communicate Agents REST endpoints
angular.module('agents').factory('Agents', ['$resource',
	function($resource) {
		return $resource('api/agents/:agentId', { agentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);