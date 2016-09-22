'use strict';

angular.module('labelsApp')
  .directive('lsEnrichmentBrowser', function () {
    return {
        templateUrl: "scripts/components/concept-detail/enrichment-browser/enrichment-browser.html",
        restrict: 'E',
        link: function postLink(scope) {

        }
    };
  });
