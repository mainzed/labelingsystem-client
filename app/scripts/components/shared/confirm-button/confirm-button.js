'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:confirmButton
 * @description
 * # confirmButton
 */
angular.module('labelsApp')
  .directive('lsConfirmButton', function () {
    return {
        templateUrl: "scripts/components/shared/confirm-button/confirm-button.html",
        restrict: 'E',
        scope: {
            onConfirm: '&',  // passes on-confirm attribute to this scope
            text: "@"  // custom delete text
        },
        link: function postLink(scope) {
            scope.showConfirm = false;
            scope.text = scope.text || "Delete";
        }
    };
  });
