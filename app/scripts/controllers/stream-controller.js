'use strict';

angular.module('app')
    .controller('StreamController', ['$scope', '$stateParams', '$interval', '$injector', '$window', 'tagStorage', '$sce', function ($scope, $stateParams, $interval, $injector, $window, tagStorage, $sce) {
        $scope.newItems = [];
        $scope.currentItems = [];
        $scope.isLoadingItems = false;
        $scope.hasOldItems = true;
        $scope.tag = tagStorage.findOne($stateParams.tag);
        
        $scope.$on('$destroy', function () {
            $interval.cancel(task);
        });
        var task = null;
        var contentProvider = $injector.get($stateParams.source);
        $scope.isLoadingItems = true;
        contentProvider.consumeNewItems($stateParams.tag, true)
            .then(function (items) {
                $scope.currentItems = items;
                task = $interval(getNewItems, 45000);
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
            $window.scrollTo(0, 0);
        };
        
        /**
         * @return {undefined}
         */
        $scope.showOldItems = function() {
            $scope.isLoadingItems = true;
            contentProvider.consumeOldItems($stateParams.tag)
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
        };

        /**
         * @return {undefined}
         */
        function getNewItems() {
            $scope.isLoadingItems = true;
            contentProvider.consumeNewItems($stateParams.tag, false)
                .then(function (items) {
                    $scope.newItems = items.concat($scope.newItems);
                })
                .finally(function () {
                    $scope.isLoadingItems = false;
                });
        }
    }]);
