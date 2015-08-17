'use strict';

// Configuring the Professors module
angular.module('professors').run(['Menus',

    function(Menus) {
		// Add the Professors dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Professors',
			state: 'professors',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'professors', {
			title: 'List Professors',
			state: 'professors.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'professors', {
			title: 'Create Professor',
			state: 'professors.create'
		});
	}
]);
