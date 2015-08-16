'use strict';

// Configuring the Students module
angular.module('students').run(['Menus',
	function(Menus) {
		// Add the Students dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Students',
			state: 'students',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'students', {
			title: 'List Students',
			state: 'students.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'students', {
			title: 'Create Student',
			state: 'students.create'
		});
	}
]);