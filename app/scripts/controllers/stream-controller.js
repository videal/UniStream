'use strict';

angular.module('app')
    .controller('StreamController', ['$scope', '$stateParams', '$interval', '$injector', '$window', 'tagStorage', function ($scope, $stateParams, $interval, $injector, $window, tagStorage) {
        $scope.newItems = [];
        $scope.currentItems = [];
        $scope.isLoadingItems = false;
        $scope.showNewItems = showNewItems;
        $scope.showOldItems = showOldItems;
        $scope.gotoTop = gotoTop;
        $scope.tag = tagStorage.findOne($stateParams.tag);
        $scope.$on('$destroy', function () {
            $interval.cancel(task);
        });

        var task = null;
        var contentProvider = $injector.get($stateParams.source);
        $scope.isLoadingItems = true;
        contentProvider.consumeNewItems($stateParams.tag)
            .then(function (items) {
                $scope.currentItems = items;
                task = $interval(getNewItems, 45000);
            })
            .finally(function () {
                $scope.isLoadingItems = false;
            });

        /**
         * @return {undefined}
         */
        function gotoTop() {
            $window.scrollTo(0, 0);
        }
        
        /**
         * @return {undefined}
         */
        function showOldItems() {
            $scope.isLoadingItems = true;
            contentProvider.consumeOldItems($stateParams.tag)
                .then(function (items) {
                    $scope.currentItems =
                        $scope.currentItems.concat(items);
                })
                .finally(function () {
                    $scope.isLoadingItems = false;
                });
        }
        
        /**
         * @return {undefined}
         */
        function showNewItems() {
            $scope.currentItems =
                $scope.newItems.concat($scope.currentItems);
            $scope.newItems = [];
        }
        
        /**
         * @return {undefined}
         */
        function getNewItems() {
            $scope.isLoadingItems = true;
            contentProvider.consumeNewItems($stateParams.tag)
                .then(function (items) {
                    $scope.newItems = items.concat($scope.newItems);
                })
                .finally(function () {
                    $scope.isLoadingItems = false;
                });
        }
    }]);
