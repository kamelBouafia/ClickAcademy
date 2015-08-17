'use strict';

var LessonModule = angular.module('lessons');

// Lessons controller
LessonModule.controller('LessonsController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Lessons','$modal', '$log','Logs','Socket',
	function($scope, $stateParams, $http, $location, Authentication, Lessons, $modal, $log, Logs, Socket) {
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
                        lesson.$save({formationId: $stateParams.formationId},function(response) {
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
            $http.put('/api/lessons/'+$stateParams.lessonId, $scope.lesson)
                .success(function (response) {
                    $scope.lesson = response;
                    $location.path('lessons/' + $stateParams.lessonId);
                });
			/*var lesson = $scope.lesson ;

			lesson.$update({formationId: $stateParams.formationId}, function() {
				$location.path('lessons/' + lesson._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
		};

		// Find a list of Lessons
		$scope.find = this.find = function() {
            Socket.emit('sendMsg', 'something to be sent');
            console.log("sending : ");
			Lessons.query({formationId: $stateParams.formationId},
                function (response) {
                    //console.log('dfvdffdvdfvdfv');
                    $scope.lessons = response;
                    //$scope.comment.push(response);
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }
            );
            //console.log('client getting the lessons : '+$scope.lessons.length);
		};

		// Find existing Lesson
		$scope.findOne = function() {
            $http.get('/api/lessons/'+$stateParams.lessonId)
                .success(function (response) {
                    $scope.lesson = response;
                });
			/*$scope.lesson = Lessons.get({
				lessonId: $stateParams.lessonId
			});*/
		};

        Socket.on('sendMsg', function(message) {
            console.log("receiving : "+ message);
        });
	}
]);
LessonModule.directive('levelsList', ['Lessons', function(Customers, Notify){
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


