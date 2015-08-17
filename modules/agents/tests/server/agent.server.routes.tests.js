'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Agent = mongoose.model('Agent'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, agent;

/**
 * Agent routes tests
 */
describe('Agent CRUD tests', function() {
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

		// Save a user to the test db and create new Agent
		user.save(function() {
			agent = {
				name: 'Agent Name'
			};

			done();
		});
	});

	it('should be able to save Agent instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Agent
				agent.post('/api/agents')
					.send(agent)
					.expect(200)
					.end(function(agentSaveErr, agentSaveRes) {
						// Handle Agent save error
						if (agentSaveErr) done(agentSaveErr);

						// Get a list of Agents
						agent.get('/api/agents')
							.end(function(agentsGetErr, agentsGetRes) {
								// Handle Agent save error
								if (agentsGetErr) done(agentsGetErr);

								// Get Agents list
								var agents = agentsGetRes.body;

								// Set assertions
								(agents[0].user._id).should.equal(userId);
								(agents[0].name).should.match('Agent Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Agent instance if not logged in', function(done) {
		agent.post('/api/agents')
			.send(agent)
			.expect(403)
			.end(function(agentSaveErr, agentSaveRes) {
				// Call the assertion callback
				done(agentSaveErr);
			});
	});

	it('should not be able to save Agent instance if no name is provided', function(done) {
		// Invalidate name field
		agent.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Agent
				agent.post('/api/agents')
					.send(agent)
					.expect(400)
					.end(function(agentSaveErr, agentSaveRes) {
						// Set message assertion
						(agentSaveRes.body.message).should.match('Please fill Agent name');
						
						// Handle Agent save error
						done(agentSaveErr);
					});
			});
	});

	it('should be able to update Agent instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Agent
				agent.post('/api/agents')
					.send(agent)
					.expect(200)
					.end(function(agentSaveErr, agentSaveRes) {
						// Handle Agent save error
						if (agentSaveErr) done(agentSaveErr);

						// Update Agent name
						agent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Agent
						agent.put('/api/agents/' + agentSaveRes.body._id)
							.send(agent)
							.expect(200)
							.end(function(agentUpdateErr, agentUpdateRes) {
								// Handle Agent update error
								if (agentUpdateErr) done(agentUpdateErr);

								// Set assertions
								(agentUpdateRes.body._id).should.equal(agentSaveRes.body._id);
								(agentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Agents if not signed in', function(done) {
		// Create new Agent model instance
		var agentObj = new Agent(agent);

		// Save the Agent
		agentObj.save(function() {
			// Request Agents
			request(app).get('/api/agents')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Agent if not signed in', function(done) {
		// Create new Agent model instance
		var agentObj = new Agent(agent);

		// Save the Agent
		agentObj.save(function() {
			request(app).get('/api/agents/' + agentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', agent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Agent instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Agent
				agent.post('/api/agents')
					.send(agent)
					.expect(200)
					.end(function(agentSaveErr, agentSaveRes) {
						// Handle Agent save error
						if (agentSaveErr) done(agentSaveErr);

						// Delete existing Agent
						agent.delete('/api/agents/' + agentSaveRes.body._id)
							.send(agent)
							.expect(200)
							.end(function(agentDeleteErr, agentDeleteRes) {
								// Handle Agent error error
								if (agentDeleteErr) done(agentDeleteErr);

								// Set assertions
								(agentDeleteRes.body._id).should.equal(agentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Agent instance if not signed in', function(done) {
		// Set Agent user 
		agent.user = user;

		// Create new Agent model instance
		var agentObj = new Agent(agent);

		// Save the Agent
		agentObj.save(function() {
			// Try deleting Agent
			request(app).delete('/api/agents/' + agentObj._id)
			.expect(403)
			.end(function(agentDeleteErr, agentDeleteRes) {
				// Set message assertion
				(agentDeleteRes.body.message).should.match('User is not authorized');

				// Handle Agent error error
				done(agentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Agent.remove().exec(function(){
				done();
			});
		});
	});
});
