'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:altLabelBox
 * @description
 * # altLabelBox
 */
angular.module('labelsApp')
  .directive('altLabelBox', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the altLabelBox directive');
      }
    };
  });
