'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:listBox
 * @description
 * # listBox
 */
angular.module('labelsApp')
  .directive('listBox', function () {
    return {
        templateUrl: "views/directives/list-box.html",
        restrict: 'E',
        link: function postLink(scope) {

            scope.$watch("extentAll", function() {
                scope.showMore = scope.extentAll;
                $(".nano").nanoScroller();
            });

            scope.toggleExtension = function() {
                scope.showMore = !scope.showMore;
            };

            /**
             * Watcher that resets nanoscroll each time a concept is extended
             * to show additional details.
             */
            scope.$watch("showMore", function() {
                $(".nano").nanoScroller();
            });

        }
    };
  });
