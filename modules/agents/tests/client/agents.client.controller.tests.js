'use strict';

(function() {
	// Agents Controller Spec
	describe('Agents Controller Tests', function() {
		// Initialize global variables
		var AgentsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Agents controller.
			AgentsController = $controller('AgentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Agent object fetched from XHR', inject(function(Agents) {
			// Create sample Agent using the Agents service
			var sampleAgent = new Agents({
				name: 'New Agent'
			});

			// Create a sample Agents array that includes the new Agent
			var sampleAgents = [sampleAgent];

			// Set GET response
			$httpBackend.expectGET('api/agents').respond(sampleAgents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.agents).toEqualData(sampleAgents);
		}));

		it('$scope.findOne() should create an array with one Agent object fetched from XHR using a agentId URL parameter', inject(function(Agents) {
			// Define a sample Agent object
			var sampleAgent = new Agents({
				name: 'New Agent'
			});

			// Set the URL parameter
			$stateParams.agentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/agents\/([0-9a-fA-F]{24})$/).respond(sampleAgent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.agent).toEqualData(sampleAgent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Agents) {
			// Create a sample Agent object
			var sampleAgentPostData = new Agents({
				name: 'New Agent'
			});

			// Create a sample Agent response
			var sampleAgentResponse = new Agents({
				_id: '525cf20451979dea2c000001',
				name: 'New Agent'
			});

			// Fixture mock form input values
			scope.name = 'New Agent';

			// Set POST response
			$httpBackend.expectPOST('api/agents', sampleAgentPostData).respond(sampleAgentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Agent was created
			expect($location.path()).toBe('/agents/' + sampleAgentResponse._id);
		}));

		it('$scope.update() should update a valid Agent', inject(function(Agents) {
			// Define a sample Agent put data
			var sampleAgentPutData = new Agents({
				_id: '525cf20451979dea2c000001',
				name: 'New Agent'
			});

			// Mock Agent in scope
			scope.agent = sampleAgentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/agents\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/agents/' + sampleAgentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid agentId and remove the Agent from the scope', inject(function(Agents) {
			// Create new Agent object
			var sampleAgent = new Agents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Agents array and include the Agent
			scope.agents = [sampleAgent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/agents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAgent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.agents.length).toBe(0);
		}));
	});
}());