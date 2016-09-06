'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:checkbox
 * @description
 * # checkbox
 */
angular.module('labelsApp')
  .directive('checkbox', function () {
    return {
      templateUrl: 'views/directives/checkbox.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the checkbox directive');
      }
    };
  });
