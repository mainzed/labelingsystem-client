'use strict';

angular.module('labelsApp')
  .directive('lsEnrichmentBrowser', function ($routeParams, VocabService, ConfigService) {
    return {
        templateUrl: "scripts/components/concept-detail/enrichment-browser/enrichment-browser.html",
        restrict: 'E',
        link: function postLink(scope) {

            // limit for concepts shown in concepts tab
            scope.conceptsLimit = ConfigService.conceptsLimit;

            // get vocab for search options
            VocabService.get({id: $routeParams.vID}, function(vocab) {
                scope.vocab = vocab;
            });
        }
    };
  });
