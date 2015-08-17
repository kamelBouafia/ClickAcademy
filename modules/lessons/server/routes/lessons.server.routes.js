'use strict';

module.exports = function(app) {
	var lessons = require('../controllers/lessons.server.controller');
    var formations = require('../../../formations/server/controllers/formations.server.controller');
	var lessonsPolicy = require('../policies/lessons.server.policy');

	// Lessons Routes
	app.route('/api/formations/:formationId/api/lessons').all()
		.get(lessons.list).all(lessonsPolicy.isAllowed)
		.post(lessons.create);

	app.route('/api/lessons/:lessonId').all(lessonsPolicy.isAllowed)
		.get(lessons.read)
		.put(lessons.update)
		.delete(lessons.delete);

	// Finish by binding the Lesson middleware
	app.param('lessonId', lessons.lessonByID);
    app.param('formationId', formations.formationByID);
};
