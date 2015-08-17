'use strict';

module.exports = function(app) {
	var professors = require('../controllers/professors.server.controller');
	var professorsPolicy = require('../policies/professors.server.policy');

	// Professors Routes
	app.route('/api/professors').all()
		.get(professors.list).all(professorsPolicy.isAllowed)
		.post(professors.create);

	app.route('/api/professors/:professorId').all(professorsPolicy.isAllowed)
		.get(professors.read)
		.put(professors.update)
		.delete(professors.delete);

	// Finish by binding the Professor middleware
	app.param('professorId', professors.professorByID);
};