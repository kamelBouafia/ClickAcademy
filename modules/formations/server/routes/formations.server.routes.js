'use strict';

module.exports = function(app) {
	var formations = require('../controllers/formations.server.controller');
	var formationsPolicy = require('../policies/formations.server.policy');

	// Formations Routes
	app.route('/api/formations').all()
		.get(formations.list).all(formationsPolicy.isAllowed)
		.post(formations.create);

	app.route('/api/formations/:formationId').all(formationsPolicy.isAllowed)
		.get(formations.read)
		.put(formations.update)
		.delete(formations.delete);

	// Finish by binding the Formation middleware
	app.param('formationId', formations.formationByID);
};