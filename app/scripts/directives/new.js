'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:new
 * @description
 * # new
 */
angular.module('labelsApp')
  .directive('new', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the new directive');
      }
    };
  });
