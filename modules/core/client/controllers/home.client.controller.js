'use strict';

angular.module('core').controller('HomeController', ['$scope','$http','$modal','Authentication',
	function($scope,$http , $modal, Authentication) {
		// This provides Authentication context.
        $scope.authentication = Authentication;

        /**/

        (function (size) {
            $http.get('/api/check/admin').success(function(response){
                if(!response.exist){
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'modules/users/views/authentication/signup.client.view.html',
                        controller: 'SignupController',
                        size: size,
                        resolve: {
                        }
                    });
                }
            }).error(function(err){
                $scope.error = err.message;
            });
        })();
	}

]);


angular.module('core').controller('SignupController',['$scope','$location','$http','$modalInstance','Authentication',
    function($scope,$location,$http,$modalInstance,Authentication){

        $scope.authentication = Authentication;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        if ($scope.authentication.user) $location.path('/');

        $scope.signup = function() {
            $http.post('/api/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
                $scope.cancel();
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

}]);
