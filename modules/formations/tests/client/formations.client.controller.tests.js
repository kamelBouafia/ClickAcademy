'use strict';

(function() {
	// Formations Controller Spec
	describe('Formations Controller Tests', function() {
		// Initialize global variables
		var FormationsController,
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

			// Initialize the Formations controller.
			FormationsController = $controller('FormationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Formation object fetched from XHR', inject(function(Formations) {
			// Create sample Formation using the Formations service
			var sampleFormation = new Formations({
				name: 'New Formation'
			});

			// Create a sample Formations array that includes the new Formation
			var sampleFormations = [sampleFormation];

			// Set GET response
			$httpBackend.expectGET('api/formations').respond(sampleFormations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.formations).toEqualData(sampleFormations);
		}));

		it('$scope.findOne() should create an array with one Formation object fetched from XHR using a formationId URL parameter', inject(function(Formations) {
			// Define a sample Formation object
			var sampleFormation = new Formations({
				name: 'New Formation'
			});

			// Set the URL parameter
			$stateParams.formationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/formations\/([0-9a-fA-F]{24})$/).respond(sampleFormation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.formation).toEqualData(sampleFormation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Formations) {
			// Create a sample Formation object
			var sampleFormationPostData = new Formations({
				name: 'New Formation'
			});

			// Create a sample Formation response
			var sampleFormationResponse = new Formations({
				_id: '525cf20451979dea2c000001',
				name: 'New Formation'
			});

			// Fixture mock form input values
			scope.name = 'New Formation';

			// Set POST response
			$httpBackend.expectPOST('api/formations', sampleFormationPostData).respond(sampleFormationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Formation was created
			expect($location.path()).toBe('/formations/' + sampleFormationResponse._id);
		}));

		it('$scope.update() should update a valid Formation', inject(function(Formations) {
			// Define a sample Formation put data
			var sampleFormationPutData = new Formations({
				_id: '525cf20451979dea2c000001',
				name: 'New Formation'
			});

			// Mock Formation in scope
			scope.formation = sampleFormationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/formations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/formations/' + sampleFormationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid formationId and remove the Formation from the scope', inject(function(Formations) {
			// Create new Formation object
			var sampleFormation = new Formations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Formations array and include the Formation
			scope.formations = [sampleFormation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/formations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFormation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.formations.length).toBe(0);
		}));
	});
}());