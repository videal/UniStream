'use strict';

angular.module('app')
    .controller('StreamController', ['$scope', '$stateParams', '$interval', 'twitter', 'tagStorage', function ($scope, $stateParams, $interval, twitter, tagStorage) {
        $scope.newTweets = [];
        $scope.currentTweets = [];
        $scope.showNewTweets = showNewTweets;
        $scope.tag = tagStorage.findOne($stateParams.tag);
        $scope.$on('$destroy', function () {
            $interval.cancel(task);
        });
        
        var previousQueryDate = null;
        var task = null;
        twitter.getTweets($stateParams.tag, previousQueryDate)
            .then(function (tweets) {
                previousQueryDate = new Date();
                $scope.currentTweets = tweets;
                task = $interval(getNewTweets, 2000);
            });

        /**
         * @return {undefined}
         */
        function showNewTweets() {
            $scope.currentTweets =
                $scope.newTweets.concat($scope.currentTweets);
            $scope.newTweets = [];
        }
        
        /**
         * @return {Promise}
         */
        function getNewTweets() {
            twitter.getTweets($stateParams.tag, previousQueryDate)
                .then(function (tweets) {
                    previousQueryDate = new Date();
                    $scope.newTweets = tweets.concat($scope.newTweets);
                });
        }
    }]);
