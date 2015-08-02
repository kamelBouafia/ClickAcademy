'use strict';

// Configuring the Lessons module
angular.module('lessons').run(['Menus',
	function(Menus) {
		// Add the Lessons dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Lessons',
			state: 'lessons',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'lessons', {
			title: 'List Lessons',
			state: 'lessons.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'lessons', {
			title: 'Create Lesson',
			state: 'lessons.create'
		});
	}
]);
