'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Professor = mongoose.model('Professor'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, professor;

/**
 * Professor routes tests
 */
describe('Professor CRUD tests', function() {
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

		// Save a user to the test db and create new Professor
		user.save(function() {
			professor = {
				name: 'Professor Name'
			};

			done();
		});
	});

	it('should be able to save Professor instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Professor
				agent.post('/api/professors')
					.send(professor)
					.expect(200)
					.end(function(professorSaveErr, professorSaveRes) {
						// Handle Professor save error
						if (professorSaveErr) done(professorSaveErr);

						// Get a list of Professors
						agent.get('/api/professors')
							.end(function(professorsGetErr, professorsGetRes) {
								// Handle Professor save error
								if (professorsGetErr) done(professorsGetErr);

								// Get Professors list
								var professors = professorsGetRes.body;

								// Set assertions
								(professors[0].user._id).should.equal(userId);
								(professors[0].name).should.match('Professor Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Professor instance if not logged in', function(done) {
		agent.post('/api/professors')
			.send(professor)
			.expect(403)
			.end(function(professorSaveErr, professorSaveRes) {
				// Call the assertion callback
				done(professorSaveErr);
			});
	});

	it('should not be able to save Professor instance if no name is provided', function(done) {
		// Invalidate name field
		professor.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Professor
				agent.post('/api/professors')
					.send(professor)
					.expect(400)
					.end(function(professorSaveErr, professorSaveRes) {
						// Set message assertion
						(professorSaveRes.body.message).should.match('Please fill Professor name');
						
						// Handle Professor save error
						done(professorSaveErr);
					});
			});
	});

	it('should be able to update Professor instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Professor
				agent.post('/api/professors')
					.send(professor)
					.expect(200)
					.end(function(professorSaveErr, professorSaveRes) {
						// Handle Professor save error
						if (professorSaveErr) done(professorSaveErr);

						// Update Professor name
						professor.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Professor
						agent.put('/api/professors/' + professorSaveRes.body._id)
							.send(professor)
							.expect(200)
							.end(function(professorUpdateErr, professorUpdateRes) {
								// Handle Professor update error
								if (professorUpdateErr) done(professorUpdateErr);

								// Set assertions
								(professorUpdateRes.body._id).should.equal(professorSaveRes.body._id);
								(professorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Professors if not signed in', function(done) {
		// Create new Professor model instance
		var professorObj = new Professor(professor);

		// Save the Professor
		professorObj.save(function() {
			// Request Professors
			request(app).get('/api/professors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Professor if not signed in', function(done) {
		// Create new Professor model instance
		var professorObj = new Professor(professor);

		// Save the Professor
		professorObj.save(function() {
			request(app).get('/api/professors/' + professorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', professor.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Professor instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Professor
				agent.post('/api/professors')
					.send(professor)
					.expect(200)
					.end(function(professorSaveErr, professorSaveRes) {
						// Handle Professor save error
						if (professorSaveErr) done(professorSaveErr);

						// Delete existing Professor
						agent.delete('/api/professors/' + professorSaveRes.body._id)
							.send(professor)
							.expect(200)
							.end(function(professorDeleteErr, professorDeleteRes) {
								// Handle Professor error error
								if (professorDeleteErr) done(professorDeleteErr);

								// Set assertions
								(professorDeleteRes.body._id).should.equal(professorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Professor instance if not signed in', function(done) {
		// Set Professor user 
		professor.user = user;

		// Create new Professor model instance
		var professorObj = new Professor(professor);

		// Save the Professor
		professorObj.save(function() {
			// Try deleting Professor
			request(app).delete('/api/professors/' + professorObj._id)
			.expect(403)
			.end(function(professorDeleteErr, professorDeleteRes) {
				// Set message assertion
				(professorDeleteRes.body.message).should.match('User is not authorized');

				// Handle Professor error error
				done(professorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Professor.remove().exec(function(){
				done();
			});
		});
	});
});
