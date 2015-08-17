'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Formation = mongoose.model('Formation'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, formation;

/**
 * Formation routes tests
 */
describe('Formation CRUD tests', function() {
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

		// Save a user to the test db and create new Formation
		user.save(function() {
			formation = {
				name: 'Formation Name'
			};

			done();
		});
	});

	it('should be able to save Formation instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Formation
				agent.post('/api/formations')
					.send(formation)
					.expect(200)
					.end(function(formationSaveErr, formationSaveRes) {
						// Handle Formation save error
						if (formationSaveErr) done(formationSaveErr);

						// Get a list of Formations
						agent.get('/api/formations')
							.end(function(formationsGetErr, formationsGetRes) {
								// Handle Formation save error
								if (formationsGetErr) done(formationsGetErr);

								// Get Formations list
								var formations = formationsGetRes.body;

								// Set assertions
								(formations[0].user._id).should.equal(userId);
								(formations[0].name).should.match('Formation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Formation instance if not logged in', function(done) {
		agent.post('/api/formations')
			.send(formation)
			.expect(403)
			.end(function(formationSaveErr, formationSaveRes) {
				// Call the assertion callback
				done(formationSaveErr);
			});
	});

	it('should not be able to save Formation instance if no name is provided', function(done) {
		// Invalidate name field
		formation.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Formation
				agent.post('/api/formations')
					.send(formation)
					.expect(400)
					.end(function(formationSaveErr, formationSaveRes) {
						// Set message assertion
						(formationSaveRes.body.message).should.match('Please fill Formation name');
						
						// Handle Formation save error
						done(formationSaveErr);
					});
			});
	});

	it('should be able to update Formation instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Formation
				agent.post('/api/formations')
					.send(formation)
					.expect(200)
					.end(function(formationSaveErr, formationSaveRes) {
						// Handle Formation save error
						if (formationSaveErr) done(formationSaveErr);

						// Update Formation name
						formation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Formation
						agent.put('/api/formations/' + formationSaveRes.body._id)
							.send(formation)
							.expect(200)
							.end(function(formationUpdateErr, formationUpdateRes) {
								// Handle Formation update error
								if (formationUpdateErr) done(formationUpdateErr);

								// Set assertions
								(formationUpdateRes.body._id).should.equal(formationSaveRes.body._id);
								(formationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Formations if not signed in', function(done) {
		// Create new Formation model instance
		var formationObj = new Formation(formation);

		// Save the Formation
		formationObj.save(function() {
			// Request Formations
			request(app).get('/api/formations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Formation if not signed in', function(done) {
		// Create new Formation model instance
		var formationObj = new Formation(formation);

		// Save the Formation
		formationObj.save(function() {
			request(app).get('/api/formations/' + formationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', formation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Formation instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Formation
				agent.post('/api/formations')
					.send(formation)
					.expect(200)
					.end(function(formationSaveErr, formationSaveRes) {
						// Handle Formation save error
						if (formationSaveErr) done(formationSaveErr);

						// Delete existing Formation
						agent.delete('/api/formations/' + formationSaveRes.body._id)
							.send(formation)
							.expect(200)
							.end(function(formationDeleteErr, formationDeleteRes) {
								// Handle Formation error error
								if (formationDeleteErr) done(formationDeleteErr);

								// Set assertions
								(formationDeleteRes.body._id).should.equal(formationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Formation instance if not signed in', function(done) {
		// Set Formation user 
		formation.user = user;

		// Create new Formation model instance
		var formationObj = new Formation(formation);

		// Save the Formation
		formationObj.save(function() {
			// Try deleting Formation
			request(app).delete('/api/formations/' + formationObj._id)
			.expect(403)
			.end(function(formationDeleteErr, formationDeleteRes) {
				// Set message assertion
				(formationDeleteRes.body.message).should.match('User is not authorized');

				// Handle Formation error error
				done(formationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Formation.remove().exec(function(){
				done();
			});
		});
	});
});
