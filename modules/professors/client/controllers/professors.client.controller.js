'use strict';

// Professors controller
angular.module('professors').controller('ProfessorsController', ['$scope','$http','$modal','$log','$stateParams', '$location', 'Authentication', 'Professors','Users',
	function($scope,$http,$modal,$log,$stateParams, $location, Professors ) {


        $scope.open = function (size) {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                backdrop: false,
                templateUrl: 'modules/professors/views/create-professor.client.view.html',
                controller: 'SignupProf',
                size: size,
                resolve:{
                    professors : function(){
                        return  $scope.professors;
                    }
                }
            });
        };


		// Remove existing Professor
		$scope.remove = function( professor ) {
			if ( professor ) { professor.$remove();

				for (var i in $scope.professors ) {
					if ($scope.professors [i] === professor ) {
						$scope.professors.splice(i, 1);
					}
				}
			} else {
				$scope.professor.$remove(function() {
					$location.path('professors');
				});
			}
		};

		// Update existing Professor
		$scope.update = function() {
			var professor = $scope.professor ;

			professor.$update(function() {
				$location.path('professors/' + professor._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Professors
		$scope.find = function() {
			$http.get('/api/users/listUsers',{ params:{role:'professor'}
            }).success(function(response){
                $scope.professors = response;
            }).error(function(response){
                $scope.error=response.message;
            });
		};

		// Find existing Professor
		$scope.findOne = function() {
			$scope.professor = Professors.get({ 
				professorId: $stateParams.professorId
			});
		};
	}
]);


angular.module('professors').controller('SignupProf',['$scope','$http','$modalInstance','professors',
    function ($scope, $http, $modalInstance, professors) {

        $scope.professors = professors;

        $scope.addProf = function() {
            $http.post('/api/add/addProf', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.professors.push(response);
                $modalInstance.close($scope.professors);
            }).error(function(response) {
                $scope.error = response.message;
            });
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
}]);

angular.module('professors').controller('DatepickerDemoCtrl',function($scope){
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };

});
