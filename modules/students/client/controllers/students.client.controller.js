'use strict';

// Students controller
angular.module('students').controller('StudentsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Students',
	function($scope, $http, $stateParams, $location, Authentication, Students ) {
		$scope.authentication = Authentication;

        $scope.knowingSite = '';
        $scope.knowingLieu = '';
        $scope.knowingStagiaire = '';
        $scope.knowingMagazine = '';
        $scope.knowingRadio = '';
        $scope.knowingTV = '';
        $scope.knowingSalon = '';
        $scope.knowingOther = '';
		// Create new Student
		$scope.create = function() {
			// Create new Student object
            $scope.selection = [];
            if($scope.knowingSite != '') $scope.selection.push($scope.knowingSite);;
            if($scope.knowingLieu != '') $scope.selection.push($scope.knowingLieu);
            if($scope.knowingStagiaire != '') $scope.selection.push($scope.knowingStagiaire);
            if($scope.knowingMagazine != '') $scope.selection.push($scope.knowingMagazine);
            if($scope.knowingRadio != '') $scope.selection.push($scope.knowingRadio);
            if($scope.knowingTV != '') $scope.selection.push($scope.knowingTV);
            if($scope.knowingSalon != '') $scope.selection.push($scope.knowingSalon);
            if($scope.knowingOther != '') $scope.selection.push($scope.knowingOther);
            console.log('creating a student '+$stateParams.candidateId);
			var student = new Students ({
                candidate: $stateParams.candidateId,
                civility: this.civility,
                birthday: this.birthday,
                birthplace: this.birthplace,
                nationality: this.nationality,
                address: this.address,
                postalCode: this.postalCode,
                town: this.town,
                phone: this.phone,
                homePhone: this.homePhone,
                email: this.email,
                urgencyContact: {
                    firstName: this.firstNameUrgency,
                    lastName: this.lastNameUrgency,
                    function: this.functionUrgency,
                    address: this.addressUrgency,
                    postalCode: this.postalCodeUrgency,
                    town: this.townUrgency,
                    homePhone: this.homePhoneUrgency,
                    phone: this.phoneUrgency,
                    workPhone: this.workPhoneUrgency,
                    email: this.emailUrgency
                },
                knowingUsBy: $scope.selection
			});

            console.log('creating a student '+student.civility);
			// Redirect after save
			student.$save({lessonId: $stateParams.lessonId, levelId: $stateParams.levelId},
                function(response) {
				$location.path('/lessons/'+$stateParams.lessonId+'/levels/'+$stateParams.levelId+'/students/' + response._id);

				// Clear form fields
				//$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Student
		$scope.remove = function( student ) {
			if ( student ) { student.$remove();

				for (var i in $scope.students ) {
					if ($scope.students [i] === student ) {
						$scope.students.splice(i, 1);
					}
				}
			} else {
				$scope.student.$remove(function() {
					$location.path('students');
				});
			}
		};

		// Update existing Student
		$scope.update = function() {
			var student = $scope.student ;

			student.$update(function() {
				$location.path('students/' + student._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Students
		$scope.find = function() {
			$scope.students = Students.query({
                lessonId: $stateParams.lessonId,
                levelId: $stateParams.levelId
            });
		};

		// Find existing Student
		$scope.findOne = function() {
			$scope.student = Students.get({
                lessonId: $stateParams.lessonId,
                levelId: $stateParams.levelId,
				studentId: $stateParams.studentId
			});
		};

        // Changing into registration of a Candidate
        $scope.createStudent = function (candidate){
            //console.log('changing state into yow'+$stateParams.lessonId+' '+$stateParams.levelId+' '+candidate._id);
            $location.path('lessons/'+$stateParams.lessonId+'/levels/'+$stateParams.levelId+'/candidates/'+candidate._id+'/registration');
        };

        // Changing state into candidate.list
        $scope.listStudents = function (level, $event){
            //console.log('changing state into '+$stateParams.lessonId+' '+level._id);
            $location.path('lessons/'+$stateParams.lessonId+'/levels/'+level._id+'/students');

            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
        };

        $scope.findCandidate = function() {
            $http.get('/api/lessons/'+$stateParams.lessonId+'/api/levels/'+$stateParams.levelId+'/api/candidates/'+$stateParams.candidateId)
                .success(function (response) {
                    $scope.candidate = response;
                });

        };
	}
]);
