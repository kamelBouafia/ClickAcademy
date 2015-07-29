'use strict';

module.exports = function(app) {
	var candidates = require('../controllers/candidates.server.controller');
	var candidatesPolicy = require('../policies/candidates.server.policy');

	// Candidates Routes
	app.route('/api/candidates').all()
		.get(candidates.list).all(candidatesPolicy.isAllowed)
		.post(candidates.create);

	app.route('/api/candidates/:candidateId').all(candidatesPolicy.isAllowed)
		.get(candidates.read)
		.put(candidates.update)
		.delete(candidates.delete);

	// Finish by binding the Candidate middleware
	app.param('candidateId', candidates.candidateByID);
};