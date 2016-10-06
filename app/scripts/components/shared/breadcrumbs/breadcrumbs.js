'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('labelsApp')
  .directive('lsBreadcrumbs', function ($location, $routeParams, VocabService) {
    return {
        templateUrl: "scripts/components/shared/breadcrumbs/breadcrumbs.html",
        restrict: 'E',
        scope: {
            mode: "@"  // viewer
        },
        link: function postLink(scope) {

            scope.vocabID = $routeParams.vID;
            scope.conceptID = $routeParams.lID;

            // get vocab title
            if (scope.vocabID) {
                scope.vocab = VocabService.get({ id: scope.vocabID });
            }
      }
    };
  });
