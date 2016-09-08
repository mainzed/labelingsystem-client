'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:descriptionBox
 * @description
 * # descriptionBox
 */
angular.module('labelsApp')
  .directive('descriptionBox', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the descriptionBox directive');
      }
    };
  });
