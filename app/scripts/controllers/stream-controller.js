'use strict';

angular.module('app')
    .controller('StreamController', ['$scope', '$stateParams', '$interval', '$injector', '$window', '$document', '$sce', 'tagStorage', 'contentProviders', 'contentProviderServices', function ($scope, $stateParams, $interval, $injector, $window, $document, $sce, tagStorage, contentProviders, contentProviderServices) {
        $scope.newItems = [];
        $scope.currentItems = [];
        $scope.isLoadingItems = false;
        $scope.hasOldItems = true;
        $scope.contentProviderNames = [];
        $scope.tag = tagStorage.findOne($stateParams.tag);

        for (var i in contentProviders) {
            $scope.contentProviderNames[contentProviders[i].id] =
                contentProviders[i].name;
        }
        
        $scope.$on('$destroy', function () {
            $interval.cancel(task);
        });
        var task = null;
        var contentProvider =
            $injector.get(contentProviderServices[$stateParams.provider]);
        var itemsPerPage = 5;
        $scope.isLoadingItems = true;
        contentProvider.consumeNewItems($stateParams.tag, true, itemsPerPage)
            .then(function (items) {
                $scope.currentItems = items;
                task = $interval(getNewItems, 5000);
            })
            .finally(function () {
                $scope.isLoadingItems = false;
            });

        /**
         * @param {String} htmlCode
         * @return {Object}
         */
        $scope.renderHTML = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        /**
         * @return {undefined}
         */
        $scope.gotoTop = function() {
            $document.duScrollTo(0, 0, 1000);
        };
        
        /**
         * @return {undefined}
         */
        $scope.showOldItems = function() {
            $scope.isLoadingItems = true;
            contentProvider.consumeOldItems($stateParams.tag, itemsPerPage)
                .then(function (items) {
                    if (items.length == 0) {
                        $scope.hasOldItems = false;
                        return;
                    }
                    
                    $scope.currentItems =
                        $scope.currentItems.concat(items);
                })
                .finally(function () {
                    $scope.isLoadingItems = false;
                });
        };
        
        /**
         * @return {undefined}
         */
        $scope.showNewItems = function() {
            $scope.currentItems =
                $scope.newItems.concat($scope.currentItems);
            $scope.newItems = [];
            $scope.gotoTop();
        };

        /**
         * @return {undefined}
         */
        function getNewItems() {
            $scope.isLoadingItems = true;
            contentProvider
                .consumeNewItems($stateParams.tag, false, itemsPerPage)
                .then(function (items) {
                    $scope.newItems = items.concat($scope.newItems);
                })
                .finally(function () {
                    $scope.isLoadingItems = false;
                });
        }
    }]);
