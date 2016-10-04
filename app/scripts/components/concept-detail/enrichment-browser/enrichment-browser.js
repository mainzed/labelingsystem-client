'use strict';

angular.module('labelsApp')
  .directive('lsEnrichmentBrowser', function ($http, $document, $rootScope, $routeParams, LabelService, VocabService, ConfigService, SearchService, TooltipService) {
    return {
        templateUrl: "scripts/components/concept-detail/enrichment-browser/enrichment-browser.html",
        restrict: 'E',
        link: function postLink(scope) {

            // limit for concepts shown in concepts tab
            scope.conceptsLimit = ConfigService.conceptsLimit;

            // wait until resolved
            // scope.label.$promise.then(function() {
            //     LabelService.query({'vocab': $routeParams.vID}, function(concepts) {
            //         scope.siblings = _.filter(concepts, function(o) {
            //             return o.id !== $routeParams.lID;  // skip current concept
            //         });
            //     });
            // });


            // get thesauri when label is available
            VocabService.get({id: $routeParams.vID}, function(vocab) {
                scope.vocab = vocab;

                scope.getEnrichmentVocab();

                scope.vocab.getThesauri(function(thesauri) {
                    scope.thesauri = thesauri;

                    // auto init
                    scope.searchValue = scope.label.thumbnail;
                    scope.onSearchClick();
                });
            });

            $rootScope.$on("changedEnrichmentVocab", function(vocabID) {
                scope.siblings = [];
                scope.getEnrichmentVocab(vocabID.id);
            });

            scope.getEnrichmentVocab = function() {

                scope.vocab.getEnrichmentVocab(function(vocabID) {
                    // get vocab name
                    VocabService.get({id: vocabID}, function(vocab) {
                        scope.enrichmentVocab = vocab;
                    });

                    // get concepts of vocab to be shown
                    LabelService.query({'vocab': vocabID}, function(concepts) {
                        scope.siblings = _.filter(concepts, function(o) {
                            return o.id !== $routeParams.lID;  // skip current concept
                        });
                    });
                });
            };

            // when searching, append search results
            // search when something is entered,
            // ls results are cached anyway, everything else gets searched on change
            scope.onSearchClick = function() {
                scope.resultBoxes = [];

                // search in all thesauri and append as soon as they're found!
                scope.thesauri.forEach(function(thesaurus) {
                    if (thesaurus.checked) {

                        SearchService.query({retcat: thesaurus.name, query: scope.searchValue}, function(results) {

                            if (thesaurus.name === "Local Labeling System") {
                                results = _.filter(results, function(o) {
                                    //console.log(o.scheme);
                                    //console.log(scope.vocab.title);
                                    return o.scheme !== scope.vocab.title;  // skip same vocab concepts
                                });

                            } else if (thesaurus.name === "this." + scope.vocab.id) {
                                results = _.filter(results, function(o) {
                                    return o.uri.split("/").pop() !== scope.label.id;  // skip current concept
                                });
                            }
                            //
                            scope.resultBoxes = $.merge(scope.resultBoxes, results);
                        }, function error(res) {
                            console.log(res);
                        });
                    }
                });
            };

            scope.$on("changedThesauri", function() {
                if (scope.searchValue) {
                    scope.onSearchClick();
                }
            });

            // scope.orderByLabel = function(concept) {
            //     return concept.thumbnail;
            // };

            // press "enter" to start search
            scope.onSearchKeyPress = function(e) {
                if (e.keyCode === 13) {
                    scope.onSearchClick();
                }
            };

            scope.tooltips = TooltipService;

        }
    };
  });
