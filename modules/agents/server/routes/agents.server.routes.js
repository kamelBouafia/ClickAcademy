'use strict';

module.exports = function(app) {
	var agents = require('../controllers/agents.server.controller');
	var agentsPolicy = require('../policies/agents.server.policy');

	// Agents Routes
	app.route('/api/agents').all()
		.get(agents.list).all(agentsPolicy.isAllowed)
		.post(agents.create);

	app.route('/api/agents/:agentId').all(agentsPolicy.isAllowed)
		.get(agents.read)
		.put(agents.update)
		.delete(agents.delete);

	// Finish by binding the Agent middleware
	app.param('agentId', agents.agentByID);
};