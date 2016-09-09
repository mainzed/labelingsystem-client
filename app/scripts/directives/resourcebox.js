'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:resourceBox
 * @description
 * # resourceBox
 */
angular.module('labelsApp')
  .directive('resourceBox', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the resourceBox directive');
      }
    };
  });
