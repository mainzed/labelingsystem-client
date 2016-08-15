'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:enrichmentBox
 * @description
 * # enrichmentBox
 */
angular.module('labelsApp')
  .directive('enrichmentBox', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the enrichmentBox directive');
      }
    };
  });
