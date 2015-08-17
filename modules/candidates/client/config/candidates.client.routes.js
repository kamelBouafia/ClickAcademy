'use strict';

//Setting up route
angular.module('candidates').config(['$stateProvider',
	function($stateProvider) {
		// Candidates state routing
        $stateProvider.
            state('all-candidates', {
                abstract: true,
                url: '/candidates',
                template: '<ui-view/>'
            }).
            state('all-candidates.list', {
                url: '',
                templateUrl: 'modules/candidates/views/list-all-candidates.client.view.html'
            });

        $stateProvider.
            state('formation-candidates', {
                abstract: true,
                url: '/formations/:formationId/candidates',
                template: '<ui-view/>'
            }).
            state('formation-candidates.list', {
                url: '',
                templateUrl: 'modules/candidates/views/list-formation-candidates.client.view.html'
            });

        $stateProvider.
            state('lesson-candidates', {
                abstract: true,
                url: '/lessons/:lessonId/candidates',
                template: '<ui-view/>'
            }).
            state('lesson-candidates.list', {
                url: '',
                templateUrl: 'modules/candidates/views/list-lesson-candidates.client.view.html'
            });

		$stateProvider.
		state('candidates', {
			abstract: true,
			url: '/lessons/:lessonId/levels/:levelId/candidates',
			template: '<ui-view/>'
		}).
		state('candidates.list', {
			url: '',
			templateUrl: 'modules/candidates/views/list-candidates.client.view.html'
		}).
		state('candidates.create', {
			url: '/create',
			templateUrl: 'modules/candidates/views/create-candidate.client.view.html'
		}).
		state('candidates.view', {
			url: '/:candidateId',
			templateUrl: 'modules/candidates/views/view-candidate.client.view.html'
		}).
		state('candidates.edit', {
			url: '/:candidateId/edit',
			templateUrl: 'modules/candidates/views/edit-candidate.client.view.html'
		});

	}
]);
