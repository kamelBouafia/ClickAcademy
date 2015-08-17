'use strict';

// Configuring the Agents module
angular.module('agents').run(['Menus',
	function(Menus) {
		// Add the Agents dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Agents',
			state: 'agents',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'agents', {
			title: 'List Agents',
			state: 'agents.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'agents', {
			title: 'Create Agent',
			state: 'agents.create'
		});
	}
]);