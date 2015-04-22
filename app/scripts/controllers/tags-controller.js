'use strict';

angular.module('app')
    .controller('TagsController', ['$scope', 'tagStorage', function ($scope, tagStorage) {
        $scope.newTag = {name: ''};
        $scope.contentSource = 'instagram';
        $scope.tags = tagStorage.findAll();
        
        /**
         * @param {Object} form
         * @return {undefined}
         */
        $scope.addTag = function(form) {
            if (!form.$valid) {
                return;
            }

            tagStorage.add($scope.newTag);
            $scope.newTag = {name: ''};
            form.$setPristine();
            form.$setUntouched();
        };

        /**
         * @param {Object} tag
         * @param {Object} $event
         * @return {undefined}
         */
        $scope.removeTag = function(tag, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            tagStorage.remove(tag);
        };
    }]);
