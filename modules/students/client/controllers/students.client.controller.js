'use strict';

// Students controller
angular.module('students').controller('StudentsController', ['$scope','$http','$modal', '$stateParams', '$location', 'Authentication', 'Students',
	function($scope,$http ,$modal ,$stateParams, $location, Authentication, Students ) {
		$scope.authentication = Authentication;


        $scope.open = function (size) {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                backdrop: false,
                templateUrl: 'modules/students/views/create-student.client.view.html',
                controller: 'SignupStudent',
                size: size,
                resolve:{
                    students : function(){
                        return $scope.students
                    }
                }
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
            $http.get('/api/users/listUsers',{ params:{role:'student'}
            }).success(function(response){
                $scope.students = response;
                console.log($scope.students);
            }).error(function(response){
                $scope.error=response.message;
            });
		};

		// Find existing Student
		$scope.findOne = function() {
			$scope.student = Students.get({ 
				studentId: $stateParams.studentId
			});
		};
	}
]);


angular.module('students').controller('SignupStudent',['$scope','$http','$modalInstance','students',
    function ($scope,$http, $modalInstance,students) {


        $scope.students = students;

        $scope.addStudent = function() {
            $http.post('/api/add/addStudent', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.students.push(response);
                $modalInstance.close($scope.students);
            }).error(function(response) {
                $scope.error = response.message;
            });
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
