'use strict';

angular.module('app', ['ui.router', 'infinite-scroll', 'LocalStorageModule'])
    .constant('instagramClientId', '0b5021fd8589490ca339dff05ed9772b')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/tags');
        
        $stateProvider
            .state('tags', {
                url: '/tags',
                templateUrl: 'views/tags.html',
                controller: 'TagsController'
            })
            .state('stream', {
                url: '/stream/:source/:tag',
                templateUrl: 'views/stream.html',
                controller: 'StreamController'
            });
    }]);
