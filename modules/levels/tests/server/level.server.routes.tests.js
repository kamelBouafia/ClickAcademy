'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Level = mongoose.model('Level'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, level;

/**
 * Level routes tests
 */
describe('Level CRUD tests', function() {
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

		// Save a user to the test db and create new Level
		user.save(function() {
			level = {
				name: 'Level Name'
			};

			done();
		});
	});

	it('should be able to save Level instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Level
				agent.post('/api/levels')
					.send(level)
					.expect(200)
					.end(function(levelSaveErr, levelSaveRes) {
						// Handle Level save error
						if (levelSaveErr) done(levelSaveErr);

						// Get a list of Levels
						agent.get('/api/levels')
							.end(function(levelsGetErr, levelsGetRes) {
								// Handle Level save error
								if (levelsGetErr) done(levelsGetErr);

								// Get Levels list
								var levels = levelsGetRes.body;

								// Set assertions
								(levels[0].user._id).should.equal(userId);
								(levels[0].name).should.match('Level Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Level instance if not logged in', function(done) {
		agent.post('/api/levels')
			.send(level)
			.expect(403)
			.end(function(levelSaveErr, levelSaveRes) {
				// Call the assertion callback
				done(levelSaveErr);
			});
	});

	it('should not be able to save Level instance if no name is provided', function(done) {
		// Invalidate name field
		level.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Level
				agent.post('/api/levels')
					.send(level)
					.expect(400)
					.end(function(levelSaveErr, levelSaveRes) {
						// Set message assertion
						(levelSaveRes.body.message).should.match('Please fill Level name');
						
						// Handle Level save error
						done(levelSaveErr);
					});
			});
	});

	it('should be able to update Level instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Level
				agent.post('/api/levels')
					.send(level)
					.expect(200)
					.end(function(levelSaveErr, levelSaveRes) {
						// Handle Level save error
						if (levelSaveErr) done(levelSaveErr);

						// Update Level name
						level.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Level
						agent.put('/api/levels/' + levelSaveRes.body._id)
							.send(level)
							.expect(200)
							.end(function(levelUpdateErr, levelUpdateRes) {
								// Handle Level update error
								if (levelUpdateErr) done(levelUpdateErr);

								// Set assertions
								(levelUpdateRes.body._id).should.equal(levelSaveRes.body._id);
								(levelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Levels if not signed in', function(done) {
		// Create new Level model instance
		var levelObj = new Level(level);

		// Save the Level
		levelObj.save(function() {
			// Request Levels
			request(app).get('/api/levels')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Level if not signed in', function(done) {
		// Create new Level model instance
		var levelObj = new Level(level);

		// Save the Level
		levelObj.save(function() {
			request(app).get('/api/levels/' + levelObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', level.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Level instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Level
				agent.post('/api/levels')
					.send(level)
					.expect(200)
					.end(function(levelSaveErr, levelSaveRes) {
						// Handle Level save error
						if (levelSaveErr) done(levelSaveErr);

						// Delete existing Level
						agent.delete('/api/levels/' + levelSaveRes.body._id)
							.send(level)
							.expect(200)
							.end(function(levelDeleteErr, levelDeleteRes) {
								// Handle Level error error
								if (levelDeleteErr) done(levelDeleteErr);

								// Set assertions
								(levelDeleteRes.body._id).should.equal(levelSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Level instance if not signed in', function(done) {
		// Set Level user 
		level.user = user;

		// Create new Level model instance
		var levelObj = new Level(level);

		// Save the Level
		levelObj.save(function() {
			// Try deleting Level
			request(app).delete('/api/levels/' + levelObj._id)
			.expect(403)
			.end(function(levelDeleteErr, levelDeleteRes) {
				// Set message assertion
				(levelDeleteRes.body.message).should.match('User is not authorized');

				// Handle Level error error
				done(levelDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Level.remove().exec(function(){
				done();
			});
		});
	});
});
