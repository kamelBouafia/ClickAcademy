'use strict';

module.exports = function(app) {
	var candidates = require('../controllers/candidates.server.controller');
    var levels = require('../../../levels/server/controllers/levels.server.controller');
    var lessons = require('../../../lessons/server/controllers/lessons.server.controller');
	var candidatesPolicy = require('../policies/candidates.server.policy');

	// Candidates Routes
	app.route('/api/lessons/:lessonId/api/levels/:levelId/api/candidates').all()
		.get(candidates.list).all(candidatesPolicy.isAllowed)
		.post(candidates.create);

    app.route('/api/candidates').all()
        .get(candidates.listAll).all(candidatesPolicy.isAllowed);

	app.route('/api/lessons/:lessonId/api/levels/:levelId/api/candidates/:candidateId').all(candidatesPolicy.isAllowed)
		.get(candidates.read)
		.put(candidates.update)
		.delete(candidates.delete);

	// Finish by binding the Candidate middleware
	app.param('candidateId', candidates.candidateByID);
    app.param('levelId', levels.levelByID);
    app.param('lessonId', lessons.lessonByID);
};
