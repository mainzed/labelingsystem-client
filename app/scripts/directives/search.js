'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:search
 * @description
 * # search
 */
angular.module('labelsApp')
  .directive('search', function () {
    return {
      templateUrl: 'views/directives/search.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          //console.log(element[1]);
        // listener to focus search
        // scope.$watch("focusSearch", function(newValue, oldValue) {
        //     //console.log(newValue);
        //     //   if (newValue === true) {
        //     //       element[1].focus();
        //     //   }
        // });
      }
    };
  });
