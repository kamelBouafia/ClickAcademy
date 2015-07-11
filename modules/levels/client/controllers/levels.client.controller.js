'use strict';

// Levels controller
angular.module('levels').controller('LevelsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Levels', '$modal',
	function($scope, $http, $stateParams, $location, Authentication, Levels, $modal ) {
		$scope.authentication = Authentication;

        this.modalCreate = function (selectedLesson) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/levels/views/create-level.client.view.html',
                controller: function ($scope, $modalInstance, parentScope, lesson) {
                    $scope.lesson = lesson;
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
                                //console.log('yow yow level has been created ');
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

        // Open a modal window to update a single event record
        this.modalUpdate = function( selectedLesson, selectedLevel){
            //console.log("yow yow from modalUpdate");
            var modalInstance = $modal.open({
                templateUrl:'modules/levels/views/edit-level.client.view.html',
                controller: function($scope, $modalInstance, lesson, level) {
                    $scope.level = level;
                    $scope.lesson = lesson;

                    $scope.value = parseInt(level.name);
                    $scope.$watch('value',function(val,old){
                        $scope.value = parseInt(val);
                        $scope.level.name=$scope.value;
                    });

                    // Update existing Level
                    $scope.update = function() {

                        var level = $scope.level ;

                        level.$update( {lessonId: lesson._id},
                            function() {
                                //$location.path('levels/' + level._id);
                            }, function(errorResponse) {
                                $scope.error = errorResponse.data.message;
                            }
                        );
                    };

                    $scope.ok = function () {
                        $scope.update();
                        modalInstance.close($scope.level);
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    level: function(){
                        return selectedLevel;
                    },
                    lesson: function(){
                        return selectedLesson;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function (){
                //$log.info('Modal dismissed at: ' + new Date());
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
angular.module('levels').filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            item.name=parseInt(item.name);
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            //return (a[field] > b[field] ? 1 : -1);
            return (a.name > b.name ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});
