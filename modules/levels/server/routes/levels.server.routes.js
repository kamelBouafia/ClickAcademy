'use strict';

module.exports = function(app) {
	var levels = require('../controllers/levels.server.controller');
	var levelsPolicy = require('../policies/levels.server.policy');

	// Levels Routes
	app.route('/api/levels').all()
		.get(levels.list).all(levelsPolicy.isAllowed)
		.post(levels.create);

	app.route('/api/levels/:levelId').all(levelsPolicy.isAllowed)
		.get(levels.read)
		.put(levels.update)
		.delete(levels.delete);

	// Finish by binding the Level middleware
	app.param('levelId', levels.levelByID);
};