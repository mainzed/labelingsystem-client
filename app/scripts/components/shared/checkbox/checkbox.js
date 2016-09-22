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
        templateUrl: 'scripts/components/shared/checkbox/checkbox.html',
        restrict: 'E',
        scope: {
            ngModel: '=',  // two-way binding
            onCheck: '&'  // references parent-scope function
        }
    };
});
