'use strict';

var FormationModule = angular.module('formations');

// Formations controller
FormationModule.controller('FormationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Formations', '$modal', '$log','Logs','Socket',
	function($scope, $stateParams, $location, Authentication, Formations, $modal, $log, Logs, Socket ) {
		$scope.authentication = Authentication;

        this.modalCreate = function (size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/formations/views/create-formation.client.view.html',
                controller: function ($scope, $modalInstance, parentScope) {
                    $scope.create = function() {
                        // Create new Evenement object
                        var formation = new Formations ({
                            name: $scope.name,
                            description: $scope.description
                        });

                        console.log(formation.name);
                        // Redirect after save
                        formation.$save(function(response) {
                            //console.log("yow yow event has been created ");
                            parentScope.find();
                            //Socket.emit('send', "creating formation");
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
                    formation: function () {
                        return $scope.formation;
                    },
                    parentScope:function(){
                        return $scope;
                    }
                }
            });
        };

        // Create new Formation
		$scope.create = function() {
			// Create new Formation object
			var formation = new Formations ({
				name: this.name
			});

			// Redirect after save
			formation.$save(function(response) {
				$location.path('formations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Formation
		$scope.remove = function( formation ) {
			if ( formation ) { formation.$remove();

				for (var i in $scope.formations ) {
					if ($scope.formations [i] === formation ) {
						$scope.formations.splice(i, 1);
					}
				}
			} else {
				$scope.formation.$remove(function() {
					$location.path('formations');
				});
			}
		};

		// Update existing Formation
		$scope.update = function() {
			var formation = $scope.formation ;

			formation.$update(function() {
				$location.path('formations/' + formation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Formations
		$scope.find = function() {
			$scope.formations = Formations.query();
		};

		// Find existing Formation
		$scope.findOne = function() {
			$scope.formation = Formations.get({ 
				formationId: $stateParams.formationId
			});
		};
	}
]);

FormationModule.directive('lessonsList', ['Formations', function(Customers, Notify){
    return {
        restrict :'E',
        transclude: true,
        templateUrl:'modules/lessons/views/list-lessons.client.view.html',
        link: function(scope, element, attrs) {

            //when a new customer is added, update the customers list
            /*Notify.getMsg('NewCustomer', function(event, data){
             scope.customersCtrl.customers = Customers.query();
             });*/
        }
    };
}]);
