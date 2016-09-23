'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:miniPreview
 * @description
 * # miniPreview
 */
angular.module('labelsApp')
  .directive('miniPreview', function () {
    return {
        templateUrl: 'scripts/components/shared/mini-preview/mini-preview.html',
        restrict: 'E',
        scope: {
            label: "=",  // uni-directional
            size: "@size"
        },
        link: function postLink(scope) {

            // by putting it in init and watch for changes it gets executed not just once
            // but everytime the data changes, this way two-way-data binding is assured
            scope.init = function() {
                scope.size = scope.size || "mini";
            };

            // reload data in case the concept gets updated
            scope.$watch("label", function() {
                scope.init();
            });
        }
    };
  });
