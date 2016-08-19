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
        link: function postLink(scope, element, attrs) {

            scope.toggleExtension = function() {
                scope.showMore = !scope.showMore;
            };

            // reload nanoscroller when directive rendered
            $(".nano").nanoScroller();  // doesnt work
        }
    };
  });
