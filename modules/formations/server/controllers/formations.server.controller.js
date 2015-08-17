'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Formation = mongoose.model('Formation'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Formation
 */
exports.create = function(req, res) {
	var formation = new Formation(req.body);
	formation.user = req.user;

	formation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(formation);
		}
	});
};

/**
 * Show the current Formation
 */
exports.read = function(req, res) {
	res.jsonp(req.formation);
};

/**
 * Update a Formation
 */
exports.update = function(req, res) {
	var formation = req.formation ;

	formation = _.extend(formation , req.body);

	formation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(formation);
		}
	});
};

/**
 * Delete an Formation
 */
exports.delete = function(req, res) {
	var formation = req.formation ;

	formation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(formation);
		}
	});
};

/**
 * List of Formations
 */
exports.list = function(req, res) { Formation.find().sort('-created').populate('user', 'displayName').exec(function(err, formations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(formations);
		}
	});
};

/**
 * Formation middleware
 */
exports.formationByID = function(req, res, next, id) { Formation.findById(id).populate('user', 'displayName').exec(function(err, formation) {
		if (err) return next(err);
		if (! formation) return next(new Error('Failed to load Formation ' + id));
		req.formation = formation ;
		next();
	});
};