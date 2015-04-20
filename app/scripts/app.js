'use strict';

angular.module('app', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/tags');
        
        $stateProvider
            .state('tags', {
                url: '/tags',
                templateUrl: 'views/tags.html',
                controller: 'TagsController'
            })
            .state('stream', {
                url: '/stream/:tag',
                templateUrl: 'views/stream.html',
                controller: 'StreamController'
            });;
    }]);
