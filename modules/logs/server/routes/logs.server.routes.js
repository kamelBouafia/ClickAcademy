'use strict';

module.exports = function(app) {
	var logs = require('../controllers/logs.server.controller');
	var logsPolicy = require('../policies/logs.server.policy');

	// Logs Routes
	app.route('/api/logs').all()
		.get(logs.list).all(logsPolicy.isAllowed)
		.post(logs.create);

	app.route('/api/logs/:logId').all(logsPolicy.isAllowed)
		.get(logs.read)
		.put(logs.update)
		.delete(logs.delete);

	// Finish by binding the Log middleware
	app.param('logId', logs.logByID);
};