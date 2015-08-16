'use strict';

var LessonMudule = angular.module('lessons');

// Lessons controller
LessonMudule.controller('LessonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lessons','$modal', '$log','Logs','Socket',
	function($scope, $stateParams, $location, Authentication, Lessons, $modal, $log, Logs, Socket) {
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
                            //Socket.emit('send', "creating lesson");
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });


                    };

                    $scope.ok = function () {
                        $scope.create();

                        modalInstance.close();

                         var log = new Logs ({
                            name: user.firstName +' a creé la leçon: ' + $scope.name ,
                             description: $scope.description
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
			if ( lesson ) {

                var log = new Logs ({
                    name: user.firstName +' a supprimé la leçon: ' + lesson.name

                });
//

                log.$save(function(response) {

                   // alert(lesson.name);

                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

                lesson.$remove();

                $location.path('lessons');
                $scope.lessons= this.find();


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
            Socket.emit('sendMsg', 'something to be sent');
            console.log("sending : ");
			$scope.lessons = Lessons.query();
            console.log('client getting the lessons : '+$scope.lessons.length);
		};

		// Find existing Lesson
		$scope.findOne = function() {
			$scope.lesson = Lessons.get({ 
				lessonId: $stateParams.lessonId
			});
		};

        Socket.on('sendMsg', function(message) {
            console.log("receiving : "+ message);
        });












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


