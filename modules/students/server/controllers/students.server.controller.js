'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    util = require('util'),
	path = require('path'),
	mongoose = require('mongoose'),
	Student = mongoose.model('Student'),
    Candidate = mongoose.model('Candidate'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Student
 */
exports.create = function(req, res) {
	var student = new Student(req.body);
	student.user = req.user;

    console.log(util.inspect(student, false, null));
    //console.log('creating a new student '+req.body);
	student.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            Candidate.findByIdAndUpdate(
                req.body.candidate,
                {active : true},
                function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else{
                        console.log('new student ');
                        res.jsonp(student);
                    }
                }
            );
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
exports.listLevel = function(req, res) {

    console.log(util.inspect(req, false, null));
    Student.find({$and : [{candidate : req.lesson._id},{level : req.level._id},{active : false}]})
        .sort('-created').populate('user', 'displayName').exec(function(err, students) {
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
exports.studentByID = function(req, res, next, id) {
    console.log('geting one student '+id);
    Student.findById(id)
        .populate('user', 'displayName')
        .populate({
            path: 'candidate',
            select: 'firstName lastName'
        })
        .exec(function(err, student) {
		if (err) return next(err);
		if (! student) return next(new Error('Failed to load Student ' + id));
		req.student = student ;
		next();
	});
};
