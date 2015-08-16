'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Lesson = mongoose.model('Lesson'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Lesson
 */
exports.create = function(req, res) {
	var lesson = new Lesson(req.body);
	lesson.user = req.user;

	lesson.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lesson);


		}
	});
};

/**
 * Show the current Lesson
 */
exports.read = function(req, res) {
	res.jsonp(req.lesson);
};

/**
 * Update a Lesson
 */
exports.update = function(req, res) {
	var lesson = req.lesson ;

	lesson = _.extend(lesson , req.body);

	lesson.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lesson);
		}
	});
};

/**
 * Delete an Lesson
 */
exports.delete = function(req, res) {
	var lesson = req.lesson ;

	lesson.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lesson);
		}
	});
};

/**
 * List of Lessons
 */
exports.list = function(req, res) { Lesson.find().sort('created').populate('user', 'displayName').exec(function(err, lessons) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            //console.log('yow yow '+ lessons.length);
			res.jsonp(lessons);
		}
	});
};

/**
 * Lesson middleware
 */
exports.lessonByID = function(req, res, next, id) { Lesson.findById(id).populate('user', 'displayName').exec(function(err, lesson) {
		if (err) return next(err);
		if (! lesson) return next(new Error('Failed to load Lesson ' + id));
		req.lesson = lesson ;
		next();
	});
};


exports.logging = function(io, socket) {
	// Emit the status event when a new socket client is connected
	io.emit('sendMsg', {

		text: 'Is now connected'

	});

	// Send a chat messages to all connected sockets when a message is received
	socket.on('sendMsg', function(message) {
		/*message.type = 'message';
		message.created = Date.now();
		message.profileImageURL = socket.request.user.profileImageURL;
		message.username = socket.request.user.username;*/

		// Emit the 'chatMessage' event
		io.emit('chatMessage', message);
	});


};

