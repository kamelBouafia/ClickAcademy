'use strict';

module.exports = function(app) {
	var students = require('../controllers/students.server.controller');
    var levels = require('../../../levels/server/controllers/levels.server.controller');
    var lessons = require('../../../lessons/server/controllers/lessons.server.controller');
	var studentsPolicy = require('../policies/students.server.policy');

	// Students Routes
	app.route('/api/lessons/:lessonId/api/levels/:levelId/api/students').all()
		.get(students.listLevel).all(studentsPolicy.isAllowed)
		.post(students.create);

	app.route('/api/lessons/:lessonId/api/levels/:levelId/api/students/:studentId').all(studentsPolicy.isAllowed)
		.get(students.read)
		.put(students.update)
		.delete(students.delete);

	// Finish by binding the Student middleware
	app.param('studentId', students.studentByID);
    app.param('levelId', levels.levelByID);
    app.param('lessonId', lessons.lessonByID);
};
