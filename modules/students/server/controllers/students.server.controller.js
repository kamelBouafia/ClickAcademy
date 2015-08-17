'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Student = mongoose.model('Student'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Student
 */
exports.create = function(req, res) {
	var student = new Student(req.body);
	student.user = req.user;

	student.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(student);
		}
	});
};

/**
 * Show the current Student
 */
exports.read = function(req, res) {
	res.jsonp(req.student);
};

/**
 * Update a Student
 */
exports.update = function(req, res) {
	var student = req.student ;

	student = _.extend(student , req.body);

	student.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(student);
		}
	});
};

/**
 * Delete an Student
 */
exports.delete = function(req, res) {
	var student = req.student ;

	student.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(student);
		}
	});
};

/**
 * List of Students
 */
exports.list = function(req, res) { Student.find().sort('-created').populate('user', 'displayName').exec(function(err, students) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(students);
		}
	});
};

/**
 * Student middleware
 */
exports.studentByID = function(req, res, next, id) { Student.findById(id).populate('user', 'displayName').exec(function(err, student) {
		if (err) return next(err);
		if (! student) return next(new Error('Failed to load Student ' + id));
		req.student = student ;
		next();
	});
};