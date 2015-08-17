'use strict';

//Setting up route
angular.module('agents').config(['$stateProvider',
	function($stateProvider) {
		// Agents state routing
		$stateProvider.
		state('agents', {
			abstract: true,
			url: '/agents',
			template: '<ui-view/>'
		}).
		state('agents.list', {
			url: '',
			templateUrl: 'modules/agents/views/list-agents.client.view.html'
		}).
		state('agents.create', {
			url: '/create',
			templateUrl: 'modules/agents/views/create-agent.client.view.html'
		}).
		state('agents.view', {
			url: '/:agentId',
			templateUrl: 'modules/agents/views/view-agent.client.view.html'
		}).
		state('agents.edit', {
			url: '/:agentId/edit',
			templateUrl: 'modules/agents/views/edit-agent.client.view.html'
		});
	}
]);