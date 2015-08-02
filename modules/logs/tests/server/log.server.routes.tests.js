'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Log = mongoose.model('Log'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, log;

/**
 * Log routes tests
 */
describe('Log CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Log
		user.save(function() {
			log = {
				name: 'Log Name'
			};

			done();
		});
	});

	it('should be able to save Log instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log
				agent.post('/api/logs')
					.send(log)
					.expect(200)
					.end(function(logSaveErr, logSaveRes) {
						// Handle Log save error
						if (logSaveErr) done(logSaveErr);

						// Get a list of Logs
						agent.get('/api/logs')
							.end(function(logsGetErr, logsGetRes) {
								// Handle Log save error
								if (logsGetErr) done(logsGetErr);

								// Get Logs list
								var logs = logsGetRes.body;

								// Set assertions
								(logs[0].user._id).should.equal(userId);
								(logs[0].name).should.match('Log Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Log instance if not logged in', function(done) {
		agent.post('/api/logs')
			.send(log)
			.expect(403)
			.end(function(logSaveErr, logSaveRes) {
				// Call the assertion callback
				done(logSaveErr);
			});
	});

	it('should not be able to save Log instance if no name is provided', function(done) {
		// Invalidate name field
		log.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log
				agent.post('/api/logs')
					.send(log)
					.expect(400)
					.end(function(logSaveErr, logSaveRes) {
						// Set message assertion
						(logSaveRes.body.message).should.match('Please fill Log name');
						
						// Handle Log save error
						done(logSaveErr);
					});
			});
	});

	it('should be able to update Log instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log
				agent.post('/api/logs')
					.send(log)
					.expect(200)
					.end(function(logSaveErr, logSaveRes) {
						// Handle Log save error
						if (logSaveErr) done(logSaveErr);

						// Update Log name
						log.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Log
						agent.put('/api/logs/' + logSaveRes.body._id)
							.send(log)
							.expect(200)
							.end(function(logUpdateErr, logUpdateRes) {
								// Handle Log update error
								if (logUpdateErr) done(logUpdateErr);

								// Set assertions
								(logUpdateRes.body._id).should.equal(logSaveRes.body._id);
								(logUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Logs if not signed in', function(done) {
		// Create new Log model instance
		var logObj = new Log(log);

		// Save the Log
		logObj.save(function() {
			// Request Logs
			request(app).get('/api/logs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Log if not signed in', function(done) {
		// Create new Log model instance
		var logObj = new Log(log);

		// Save the Log
		logObj.save(function() {
			request(app).get('/api/logs/' + logObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', log.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Log instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log
				agent.post('/api/logs')
					.send(log)
					.expect(200)
					.end(function(logSaveErr, logSaveRes) {
						// Handle Log save error
						if (logSaveErr) done(logSaveErr);

						// Delete existing Log
						agent.delete('/api/logs/' + logSaveRes.body._id)
							.send(log)
							.expect(200)
							.end(function(logDeleteErr, logDeleteRes) {
								// Handle Log error error
								if (logDeleteErr) done(logDeleteErr);

								// Set assertions
								(logDeleteRes.body._id).should.equal(logSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Log instance if not signed in', function(done) {
		// Set Log user 
		log.user = user;

		// Create new Log model instance
		var logObj = new Log(log);

		// Save the Log
		logObj.save(function() {
			// Try deleting Log
			request(app).delete('/api/logs/' + logObj._id)
			.expect(403)
			.end(function(logDeleteErr, logDeleteRes) {
				// Set message assertion
				(logDeleteRes.body.message).should.match('User is not authorized');

				// Handle Log error error
				done(logDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Log.remove().exec(function(){
				done();
			});
		});
	});
});
