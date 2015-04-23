'use strict';

angular.module('app')
    .directive('appAnimateOnIncrease', ['$animate', function ($animate) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.appAnimateOnIncrease, function (newValue, oldValue) {
                    if (oldValue >= newValue) {
                        return;
                    }

                    $animate.animate(
                        element, {}, {}, attrs.appAnimateOnIncreaseClass);
                });
            }
        }
    }]);
