'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Candidate = mongoose.model('Candidate'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Candidate
 */
exports.create = function(req, res) {
	var candidate = new Candidate(req.body);
	candidate.user = req.user;
    candidate.lesson = req.lesson;
    candidate.level = req.level;
    console.log('creating a candidate :'+ candidate.level+' ');

	candidate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidate);
		}
	});
};

/**
 * Show the current Candidate
 */
exports.read = function(req, res) {
	res.jsonp(req.candidate);
};

/**
 * Update a Candidate
 */
exports.update = function(req, res) {
	var candidate = req.candidate ;

	candidate = _.extend(candidate , req.body);

	candidate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidate);
		}
	});
};

/**
 * Delete an Candidate
 */
exports.delete = function(req, res) {
	var candidate = req.candidate ;

	candidate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidate);
		}
	});
};

/**
 * List of Candidates for a given level
 */
exports.list = function(req, res) {
    console.log('listing candidates : '+req.lesson._id+' '+req.level._id);
    Candidate
        .find({$and : [{lesson : req.lesson._id},{level : req.level._id},{active : false}]})
        .sort('-created').populate('user', 'displayName').exec(function(err, candidates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(candidates);
		}
	});
};

/**
 * List of Candidates
 */
exports.listAll = function(req, res) {
    Candidate
        .find({active : false})
        .sort('-created')
        .populate('user', 'displayName')
        .populate('lesson', 'name')
        .populate('level', 'name')
        .exec(function(err, candidates) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(candidates);
            }
        });
};

/**
 * List of Candidates for a lesson
 */
exports.listLesson = function(req, res) {
    Candidate
        .find({$and : [{lesson : req.lesson._id},{active : false}]})
        .sort('-created')
        .populate('user', 'displayName')
        .populate('lesson', 'name')
        .populate('level', 'name')
        .exec(function(err, candidates) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(candidates);
            }
        });
};

/**
 * Candidate middleware
 */
exports.candidateByID = function(req, res, next, id) {
    Candidate.findById(id)
        .populate('user', 'displayName')
        .populate('lesson', 'name')
        .populate('level', 'name')
        .exec(function(err, candidate) {
		if (err) return next(err);
		if (! candidate) return next(new Error('Failed to load Candidate ' + id));
		req.candidate = candidate ;
		next();
	});
};
