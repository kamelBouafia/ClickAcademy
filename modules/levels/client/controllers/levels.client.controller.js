'use strict';

// Levels controller
angular.module('levels').controller('LevelsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Levels', '$modal',
	function($scope, $http, $stateParams, $location, Authentication, Levels, $modal ) {
		$scope.authentication = Authentication;

        this.modalCreate = function (size, selectedLesson) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/levels/views/create-level.client.view.html',
                controller: function ($scope, $modalInstance, parentScope, lesson) {
                    $scope.create = function() {
                        // Create new Evenement object
                        var level = new Levels ({
                            name: $scope.name,
                            description: $scope.description
                        });

                        //console.log('jdjhd c '+lesson._id+$scope.name+' '+level.description);
                        // Redirect after save
                        level.$save({lessonId: lesson._id},
                            function(response) {
                                console.log('yow yow level has been created ');
                                //parentScope.find();
                                parentScope.levels.push(response);
                            }, function(errorResponse) {
                                //console.log('yow yow level has not been created ');
                                $scope.error = errorResponse.data.message;
                            }
                        );
                    };

                    $scope.ok = function () {
                        //console.log('jdjhd c wdddddddddddddddd');
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
                        return selectedLesson;
                    },
                    parentScope:function(){
                        return $scope;
                    }
                }
            });
        };
		// Remove existing Level
		$scope.remove = function( level ) {
			if ( level ) { level.$remove();

				for (var i in $scope.levels ) {
					if ($scope.levels [i] === level ) {
						$scope.levels.splice(i, 1);
					}
				}
			} else {
				$scope.level.$remove(function() {
					$location.path('levels');
				});
			}
		};

		// Update existing Level
		$scope.update = function() {
			var level = $scope.level ;

			level.$update(function() {
				$location.path('levels/' + level._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Levels
		$scope.find = function() {
            //$scope.levels= $http.get('api/lessons/'+$scope.lesson._id+'/api/levels');
			//$scope.levels = Levels.query();
            Levels.query( {lessonId: $stateParams.lessonId} ,
                function (response) {
                    //console.log('dfvdffdvdfvdfv');
                    $scope.levels=response;
                    //$scope.comment.push(response);
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }
            );
		};

		// Find existing Level
		$scope.findOne = function() {
			$scope.level = Levels.get({ 
				levelId: $stateParams.levelId
			});
		};
	}
]);
