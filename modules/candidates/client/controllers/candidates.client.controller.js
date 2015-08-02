'use strict';

// Candidates controller
angular.module('candidates').controller('CandidatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Candidates', '$modal',
	function($scope, $stateParams, $location, Authentication, Candidates ,$modal) {
		$scope.authentication = Authentication;



        this.modalCreate = function (selectedLevel, $event) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/candidates/views/create-candidate.client.view.html',
                controller: function ($scope, $modalInstance, parentScope, level) {
                    $scope.phoneNumbr = /^\+?\d{2}[- ]?\d{2}[- ]?\d{2}[- ]?\d{2}[- ]?\d{2}$/;
                    $scope.days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                    // selected days
                    $scope.selection = ['Dimanche', 'Lundi'];
                    // toggle selection for a given day by name
                    $scope.toggleSelection = function toggleSelection(dayName) {
                        var idx = $scope.selection.indexOf(dayName);
                        // is currently selected
                        if (idx > -1) {
                            $scope.selection.splice(idx, 1);
                        }
                        // is newly selected
                        else {
                            $scope.selection.push(dayName);
                        }
                    };

                    $scope.level = level;
                    $scope.create = function() {
                        // Create new Candidate object
                        var candidate = new Candidates ({
                            firstName: $scope.firstName,
                            lastName: $scope.lastName,
                            phone: $scope.phone,
                            disponibilite: $scope.selection,
                            lesson: level.lesson,
                            level: level._id
                        });

                        console.log('yow : '+candidate.disponibilite);
                        candidate.$save({lessonId: level.lesson, levelId: level._id},
                            function(response) {
                                console.log('yow yow level has been created ');
                                //parentScope.find();
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
                    level: function () {
                        return selectedLevel;
                    },
                    parentScope:function(){
                        return $scope;
                    }
                }
            });

            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
        };

        $scope.listCandidates = function (level, $event){
            console.log('dcjh'+$stateParams.lessonId+' '+level._id);
            $location.path('lessons/'+$stateParams.lessonId+'/levels/'+level._id+'/candidates');

            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
        };

        // Create new Candidate
		$scope.create = function() {
			// Create new Candidate object
			var candidate = new Candidates ({
				name: this.name
			});

			// Redirect after save
			candidate.$save(function(response) {
				$location.path('candidates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Candidate
		$scope.remove = function( candidate ) {
			if ( candidate ) { candidate.$remove();

				for (var i in $scope.candidates ) {
					if ($scope.candidates [i] === candidate ) {
						$scope.candidates.splice(i, 1);
					}
				}
			} else {
				$scope.candidate.$remove(function() {
					$location.path('candidates');
				});
			}
		};

		// Update existing Candidate
		$scope.update = function() {
			var candidate = $scope.candidate ;

			candidate.$update(function() {
				$location.path('candidates/' + candidate._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Candidates
		$scope.find = function() {
			$scope.candidates = Candidates.query({lessonId: $stateParams.lessonId} ,{levelId: $stateParams.levelId} );
		};

		// Find existing Candidate
		$scope.findOne = function() {
			$scope.candidate = Candidates.get({ 
				candidateId: $stateParams.candidateId
			});
		};
	}
]);
