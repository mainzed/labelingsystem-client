'use strict';

angular.module('labelsApp')
  .directive('lsEnrichmentBrowser', function ($http, $document, $routeParams, LabelService, VocabService, ConfigService, SearchService) {
    return {
        templateUrl: "scripts/components/concept-detail/enrichment-browser/enrichment-browser.html",
        restrict: 'E',
        link: function postLink(scope) {

            // limit for concepts shown in concepts tab
            scope.conceptsLimit = ConfigService.conceptsLimit;

            // wait until resolved
            scope.label.$promise.then(function() {

                // get siblings
                LabelService.query({'vocab': $routeParams.vID}, function(concepts) {
                    scope.siblings = concepts;
                });
            });


            // get thesauri when label is available
            VocabService.get({id: $routeParams.vID}, function(vocab) {
                scope.vocab = vocab;
                scope.vocab.getThesauri(function(thesauri) {
                    scope.thesauri = thesauri;
                });
            });

            // when searching, append search results
            // search when something is entered,
            // ls results are cached anyway, everything else gets searched on change
            scope.onSearchClick = function() {
                scope.resultBoxes = [];

                // search in siblings
                //$.merge(scope.resultBoxes, scope.siblings);

                // search in all thesauri and append as soon as they're found!
                scope.thesauri.forEach(function(thesaurus) {
                    if (thesaurus.checked) {
                        SearchService.search(thesaurus.name, scope.searchValue, function(results) {

                            // omit all concepts of current vocab - loaded separately
                            if (thesaurus.name === "Local Labeling System") {
                                results = _.filter(results, function(o) {
                                    return o.scheme !== scope.vocabulary.title.value;
                                });
                            }
                            $.merge(scope.resultBoxes, results);

                        }, function error(res) {
                            console.log(res);
                        });
                    }
                });
            };

            scope.orderByLabel = function(concept) {
                return concept.getLabel().value;
            };

            // press "enter" to start search
            scope.onSearchKeyPress = function(e) {
                if (e.keyCode === 13) {
                    scope.onSearchClick();
                }
            };
        }
    };
  });
