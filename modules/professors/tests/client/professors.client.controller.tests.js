'use strict';

(function() {
	// Professors Controller Spec
	describe('Professors Controller Tests', function() {
		// Initialize global variables
		var ProfessorsController,
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

			// Initialize the Professors controller.
			ProfessorsController = $controller('ProfessorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Professor object fetched from XHR', inject(function(Professors) {
			// Create sample Professor using the Professors service
			var sampleProfessor = new Professors({
				name: 'New Professor'
			});

			// Create a sample Professors array that includes the new Professor
			var sampleProfessors = [sampleProfessor];

			// Set GET response
			$httpBackend.expectGET('api/professors').respond(sampleProfessors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.professors).toEqualData(sampleProfessors);
		}));

		it('$scope.findOne() should create an array with one Professor object fetched from XHR using a professorId URL parameter', inject(function(Professors) {
			// Define a sample Professor object
			var sampleProfessor = new Professors({
				name: 'New Professor'
			});

			// Set the URL parameter
			$stateParams.professorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/professors\/([0-9a-fA-F]{24})$/).respond(sampleProfessor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.professor).toEqualData(sampleProfessor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Professors) {
			// Create a sample Professor object
			var sampleProfessorPostData = new Professors({
				name: 'New Professor'
			});

			// Create a sample Professor response
			var sampleProfessorResponse = new Professors({
				_id: '525cf20451979dea2c000001',
				name: 'New Professor'
			});

			// Fixture mock form input values
			scope.name = 'New Professor';

			// Set POST response
			$httpBackend.expectPOST('api/professors', sampleProfessorPostData).respond(sampleProfessorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Professor was created
			expect($location.path()).toBe('/professors/' + sampleProfessorResponse._id);
		}));

		it('$scope.update() should update a valid Professor', inject(function(Professors) {
			// Define a sample Professor put data
			var sampleProfessorPutData = new Professors({
				_id: '525cf20451979dea2c000001',
				name: 'New Professor'
			});

			// Mock Professor in scope
			scope.professor = sampleProfessorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/professors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/professors/' + sampleProfessorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid professorId and remove the Professor from the scope', inject(function(Professors) {
			// Create new Professor object
			var sampleProfessor = new Professors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Professors array and include the Professor
			scope.professors = [sampleProfessor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/professors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProfessor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.professors.length).toBe(0);
		}));
	});
}());