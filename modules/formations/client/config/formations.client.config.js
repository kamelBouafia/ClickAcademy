'use strict';

// Configuring the Formations module
angular.module('formations').run(['Menus',
	function(Menus) {
		// Add the Formations dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Formations',
			state: 'formations',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'formations', {
			title: 'List Formations',
			state: 'formations.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'formations', {
			title: 'Create Formation',
			state: 'formations.create'
		});
	}
]);