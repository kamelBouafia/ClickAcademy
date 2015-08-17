'use strict';

module.exports = function(app) {
	var students = require('../controllers/students.server.controller');
	var studentsPolicy = require('../policies/students.server.policy');

	// Students Routes
	app.route('/api/students').all()
		.get(students.list).all(studentsPolicy.isAllowed)
		.post(students.create);

	app.route('/api/students/:studentId').all(studentsPolicy.isAllowed)
		.get(students.read)
		.put(students.update)
		.delete(students.delete);

	// Finish by binding the Student middleware
	app.param('studentId', students.studentByID);
};