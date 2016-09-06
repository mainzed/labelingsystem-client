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
        scope: {
            ngModel: '=',  // two-way binding
            onCheck: '&'  // references parent-scope function
        }
    };
});
