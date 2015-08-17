'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Professor = mongoose.model('Professor'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Professor
 */
exports.create = function(req, res) {
	var professor = new Professor(req.body);
	professor.user = req.user;

	professor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(professor);
		}
	});
};

/**
 * Show the current Professor
 */
exports.read = function(req, res) {
	res.jsonp(req.professor);
};

/**
 * Update a Professor
 */
exports.update = function(req, res) {
	var professor = req.professor ;

	professor = _.extend(professor , req.body);

	professor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(professor);
		}
	});
};

/**
 * Delete an Professor
 */
exports.delete = function(req, res) {
	var professor = req.professor ;

	professor.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(professor);
		}
	});
};

/**
 * List of Professors
 */
exports.list = function(req, res) { Professor.find().sort('-created').populate('user', 'displayName').exec(function(err, professors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(professors);
		}
	});
};

/**
 * Professor middleware
 */
exports.professorByID = function(req, res, next, id) { Professor.findById(id).populate('user', 'displayName').exec(function(err, professor) {
		if (err) return next(err);
		if (! professor) return next(new Error('Failed to load Professor ' + id));
		req.professor = professor ;
		next();
	});
};