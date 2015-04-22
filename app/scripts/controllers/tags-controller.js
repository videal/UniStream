'use strict';

angular.module('app')
    .controller('TagsController', ['$scope', 'tagStorage', 'userSettings', 'contentProviders', function ($scope, tagStorage, userSettings, contentProviders) {
        $scope.newTag = {name: ''};
        $scope.tags = tagStorage.findAll();
        $scope.contentProviders = contentProviders;
        
        /**
         * @param {String|undefined} name
         * @return {String}
         */
        $scope.contentProvider = function (name) {
            if (angular.isDefined(name)) {
                userSettings.setContentProvider(name);
            }
            
            return userSettings.getContentProvider();
        };
        
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
