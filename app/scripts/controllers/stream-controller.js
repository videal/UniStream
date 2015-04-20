'use strict';

angular.module('app')
    .controller('StreamController', ['$scope', '$stateParams', '$interval', '$injector', 'tagStorage', function ($scope, $stateParams, $interval, $injector, tagStorage) {
        $scope.newItems = [];
        $scope.currentItems = [];
        $scope.showNewItems = showNewItems;
        $scope.tag = tagStorage.findOne($stateParams.tag);
        $scope.$on('$destroy', function () {
            $interval.cancel(task);
        });

        var previousQueryDate = null;
        var task = null;
        var contentProvider = $injector.get($stateParams.source);
        contentProvider.getItems($stateParams.tag, previousQueryDate)
            .then(function (items) {
                previousQueryDate = new Date();
                $scope.currentItems = items;
                task = $interval(getNewItems, 2000);
            });

        /**
         * @return {undefined}
         */
        function showNewItems() {
            $scope.currentItems =
                $scope.newItems.concat($scope.currentItems);
            $scope.newItems = [];
        }
        
        /**
         * @return {Promise}
         */
        function getNewItems() {
            // contentProvider.getItems($stateParams.tag, previousQueryDate)
            //     .then(function (items) {
            //         previousQueryDate = new Date();
            //         $scope.newItems = items.concat($scope.newItems);
            //     });
        }
    }]);
