'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('labelsApp')
  .directive('breadcrumbs', function ($location, $routeParams) {
    return {
      templateUrl: "views/directives/breadcrumbs.html",
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var path = $location.path();

        // check view and decide what breadcrumbs to show
        if (path.indexOf("/labels/") > -1) {
            scope.showLabelDetail = true;

        } else if (path.indexOf("/vocabularies/") > -1) {
            scope.showVocabulary = true;
        } else {
            scope.showVocabulary = false;
        }

      }
    };
  });
