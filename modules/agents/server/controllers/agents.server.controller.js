'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Agent = mongoose.model('Agent'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Agent
 */
exports.create = function(req, res) {
	var agent = new Agent(req.body);
	agent.user = req.user;

	agent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(agent);
		}
	});
};

/**
 * Show the current Agent
 */
exports.read = function(req, res) {
	res.jsonp(req.agent);
};

/**
 * Update a Agent
 */
exports.update = function(req, res) {
	var agent = req.agent ;

	agent = _.extend(agent , req.body);

	agent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(agent);
		}
	});
};

/**
 * Delete an Agent
 */
exports.delete = function(req, res) {
	var agent = req.agent ;

	agent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(agent);
		}
	});
};

/**
 * List of Agents
 */
exports.list = function(req, res) { Agent.find().sort('-created').populate('user', 'displayName').exec(function(err, agents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(agents);
		}
	});
};

/**
 * Agent middleware
 */
exports.agentByID = function(req, res, next, id) { Agent.findById(id).populate('user', 'displayName').exec(function(err, agent) {
		if (err) return next(err);
		if (! agent) return next(new Error('Failed to load Agent ' + id));
		req.agent = agent ;
		next();
	});
};