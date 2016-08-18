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
            
        }
    };
  });
