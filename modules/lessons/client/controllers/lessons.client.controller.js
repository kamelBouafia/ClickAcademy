'use strict';

// Lessons controller
angular.module('lessons').controller('LessonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lessons','$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Lessons, $modal, $log) {
		$scope.authentication = Authentication;

        this.modalCreate = function (size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/lessons/views/create-lesson.client.view.html',
                controller: function ($scope, $modalInstance, parentScope) {
                    $scope.create = function() {
                        // Create new Evenement object
                        var lesson = new Lessons ({
                            name: $scope.name,
                            description: $scope.description
                        });

                        console.log(lesson.name);
                        // Redirect after save
                        lesson.$save(function(response) {
                            //console.log("yow yow event has been created ");
                            //parentScope.find();
                            parentScope.lessons.push(response);
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    };

                    $scope.ok = function () {
                        $scope.create();
                        modalInstance.close();
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    lesson: function () {
                        return $scope.lesson;
                    },
                    parentScope:function(){
                        return $scope;
                    }
                }
            });
        };

		// Create new Lesson
		$scope.create = function() {
			// Create new Lesson object
			var lesson = new Lessons ({
				name: this.name
			});

			// Redirect after save
			lesson.$save(function(response) {
				$location.path('lessons/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Lesson
		$scope.remove = function( lesson ) {
			if ( lesson ) { lesson.$remove();

				for (var i in $scope.lessons ) {
					if ($scope.lessons [i] === lesson ) {
						$scope.lessons.splice(i, 1);
					}
				}
			} else {
				$scope.lesson.$remove(function() {
					$location.path('lessons');
				});
			}
		};

		// Update existing Lesson
		$scope.update = function() {
			var lesson = $scope.lesson ;

			lesson.$update(function() {
				$location.path('lessons/' + lesson._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Lessons
		$scope.find = this.find = function() {
			$scope.lessons = Lessons.query();
		};

		// Find existing Lesson
		$scope.findOne = function() {
			$scope.lesson = Lessons.get({ 
				lessonId: $stateParams.lessonId
			});
		};
	}
]);
angular.module('lessons').directive('levelsList', ['Lessons', function(){
    return {
        restrict :'E',
        transclude: true,
        templateUrl:'modules/levels/views/list-levels.client.view.html',
        link: function(scope, element, attrs) {

            //when a new customer is added, update the customers list
            /*Notify.getMsg('NewCustomer', function(event, data){
                scope.customersCtrl.customers = Customers.query();
            });*/
        }
    };
}]);
