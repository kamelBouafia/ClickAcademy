'use strict';

var cours = '';
// Candidates controller
angular.module('candidates').controller('CandidatesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Candidates', '$modal',
	function($scope, $http, $stateParams, $location, Authentication, Candidates ,$modal) {
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

        // Open a modal window to update a single event record
        this.modalUpdate = function( selectedCandidate){
            //console.log("yow yow from modalUpdate");
            var modalInstance = $modal.open({
                templateUrl:'modules/candidates/views/edit-candidate.client.view.html',
                controller: function($scope, $modalInstance, candidate) {
                    $scope.candidate = candidate;

                    $scope.phoneNumbr = /^\+?\d{2}[- ]?\d{2}[- ]?\d{2}[- ]?\d{2}[- ]?\d{2}$/;
                    $scope.days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                    // selected days
                    $scope.selection = candidate.disponibilite;
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

                    // Update existing Level
                    $scope.update = function() {

                        var candidate = $scope.candidate ;

                        candidate.$update( {lessonId: candidate.lesson, levelId: candidate.level},
                            function(response) {
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
                    candidate: function(){
                        return selectedCandidate;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function (){
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.listCandidates = function (level, $event){
            console.log('changing state into '+$stateParams.lessonId+' '+level._id);
            $location.path('lessons/'+$stateParams.lessonId+'/levels/'+level._id+'/candidates');

            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
        };

		// Remove existing Candidate
		$scope.remove = function( candidate ) {
            console.log('removing '+$stateParams.lessonId+' '+$stateParams.levelId);
            if ( candidate ) { candidate.$remove({lessonId: $stateParams.lessonId, levelId: $stateParams.levelId});

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

		// Find a list of Candidates for a single level
		$scope.find = function() {
			$scope.candidates = Candidates.query({lessonId: $stateParams.lessonId, levelId: $stateParams.levelId} );
		};

        // Find a list of Candidates
        $scope.findAll = function() {
            $http.get('/api/candidates/')
                .success(function (response) {
                    $scope.candidatesList = response;
                    //console.log('get all list of candidates '+response.length);
            });
        };
        // Find a list of Candidates for a lesson
        $scope.findLesson = function() {
            //console.log('get list of candidates for a lesson '+$stateParams.lessonId);
            $http.get('/api/lessons/'+$stateParams.lessonId+'/api/candidates/')
                .success(function (response) {
                    $scope.candidatesList = response;
                    $scope.coursName = response[0].lesson.name;
                });
        };

		// Find existing Candidate
		$scope.findOne = function() {
			$scope.candidate = Candidates.get({
				candidateId: $stateParams.candidateId
			});
		};
        $scope.toHTML = function() {

                //cours = $scope.coursName;
                console.log('$scope is being passed to printing function = '+ cours);
                pdfToHTML($scope);
        };


	}
]);
