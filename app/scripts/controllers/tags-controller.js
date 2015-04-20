'use strict';

angular.module('app')
    .controller('TagsController', ['$scope', 'tagStorage', function ($scope, tagStorage) {
        $scope.newTag = {name: ''};
        $scope.tags = tagStorage.findAll();
        $scope.addTag = addTag;
        $scope.removeTag = removeTag;

        /**
         * @return {undefined}
         */
        function addTag(form) {
            if (!form.$valid) {
                return;
            }

            $scope.newTag.name = $scope.newTag.name.replace(/#/g, '');
            tagStorage.add($scope.newTag);
            $scope.newTag = {name: ''};
            form.$setPristine();
            form.$setUntouched();
        }

        /**
         * @param {Object} tag
         * @param {Object} $event
         * @return {undefined}
         */
        function removeTag(tag, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            tagStorage.remove(tag);
        };
    }]);
