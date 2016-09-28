'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:checkbox
 * @description
 * # checkbox
 */
angular.module('labelsApp')
  .directive('lsRadiobox', function () {
    return {
        templateUrl: 'scripts/components/shared/radiobox/radiobox.html',
        restrict: 'E',
        scope: {
            checked: "<",
            onCheck: '&'
        }
    };
});
