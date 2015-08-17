'use strict';

// Agents controller
angular.module('agents').controller('AgentsController', ['$scope','$http' ,'$modal' , '$stateParams', '$location', 'Authentication', 'Agents',
	function($scope,$http,$modal, $stateParams, $location, Authentication, Agents ) {

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/agents/views/create-agent.client.view.html',
                controller: 'SignupAgent',
                size: size,
                resolve:{
                }
            });
        };


		// Remove existing Agent
		$scope.remove = function( agent ) {
			if ( agent ) { agent.$remove();

				for (var i in $scope.agents ) {
					if ($scope.agents [i] === agent ) {
						$scope.agents.splice(i, 1);
					}
				}
			} else {
				$scope.agent.$remove(function() {
					$location.path('agents');
				});
			}
		};

		// Update existing Agent
		$scope.update = function() {
			var agent = $scope.agent ;

			agent.$update(function() {
				$location.path('agents/' + agent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Agents
		$scope.find = function() {
            $http.get('/api/users/listUsers',{ params:{role:'agent'}
            }).success(function(response){
                $scope.agents = response;
            }).error(function(response){
                $scope.error=response.message;
            });
		};

		// Find existing Agent
		$scope.findOne = function() {
			$scope.agent = Agents.get({ 
				agentId: $stateParams.agentId
			});
		};
	}
]);


angular.module('agents').controller('SignupAgent',['$scope','$http','$modalInstance','Authentication',
    function ($scope,$http, $modalInstance,Authentication) {

        $scope.addAgent = function() {
            $http.post('/api/add/addAgent', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.cancel();
                this.find();
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
