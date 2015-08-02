'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Log = mongoose.model('Log'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Log
 */
exports.create = function(req, res) {
	var log = new Log(req.body);
	log.user = req.user;

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(log);
		}
	});
};

/**
 * Show the current Log
 */
exports.read = function(req, res) {
	res.jsonp(req.log);
};

/**
 * Update a Log
 */
exports.update = function(req, res) {
	var log = req.log ;

	log = _.extend(log , req.body);

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(log);
		}
	});
};

/**
 * Delete an Log
 */
exports.delete = function(req, res) {
	var log = req.log ;

	log.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(log);
		}
	});
};

/**
 * List of Logs
 */
exports.list = function(req, res) { Log.find().sort('-created').populate('user', 'displayName').exec(function(err, logs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logs);
		}
	});
};

/**
 * Log middleware
 */
exports.logByID = function(req, res, next, id) { Log.findById(id).populate('user', 'displayName').exec(function(err, log) {
		if (err) return next(err);
		if (! log) return next(new Error('Failed to load Log ' + id));
		req.log = log ;
		next();
	});
};