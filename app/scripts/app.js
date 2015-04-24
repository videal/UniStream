'use strict';

angular.module('app', ['ngAnimate', 'ui.router', 'infinite-scroll', 'LocalStorageModule', 'ngAnimate', 'ui.utils', 'duScroll'])
    .constant('instagramClientId', '0b5021fd8589490ca339dff05ed9772b')
    .constant('contentProviders', [
        {id: 'instagram', name: 'Instagram'},
        {id: 'googlenews', name: 'Google News'},
        {id: 'mixed', name: 'Mixed'}
    ])
    .constant('contentProviderServices', {
        instagram: 'instagram',
        googlenews: 'googlenews',
        mixed: 'mixedContentProvider'
    })
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/tags');
        
        $stateProvider
            .state('tags', {
                url: '/tags',
                templateUrl: 'views/tags.html',
                controller: 'TagsController'
            })
            .state('stream', {
                url: '/stream/:provider/:tag',
                templateUrl: 'views/stream.html',
                controller: 'StreamController'
            });
    }]);
