'use strict';

var LessonMudule = angular.module('lessons');

// Lessons controller
LessonMudule.controller('LessonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lessons','$modal', '$log','Logs',
	function($scope, $stateParams, $location, Authentication, Lessons, $modal, $log, Logs) {
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
                            parentScope.find();
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });

                        /*var phantom = require('phantom');

                       phantom.create(function (ph) {
                            ph.createPage(function (page) {
                                page.open("http://www.google.com", function (status) {
                                    console.log("opened google? ", status);
                                    page.evaluate(function () { return document.title; }, function (result) {
                                        console.log('Page title is ' + result);
                                        ph.exit();
                                    });
                                });
                            });
                        }); */

                    };

                    $scope.ok = function () {
                        $scope.create();

                        modalInstance.close();

                         var log = new Logs ({
                            name: user.firstName +' has created a lesson'
                        });

                        alert(user.firstName);
                        log.$save(function(response) {
                            //$location.path('logs/' + response._id);

                            // Clear form fields
                            $scope.name = '';
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });

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
		$scope.create = function () {
            //wkhtmltopdf http://google.com google.pdf;
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
LessonMudule.directive('levelsList', ['Lessons', function(Customers, Notify){
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


