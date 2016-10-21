"use strict";

angular.module("labelsApp")
 .component("lsEnrichmentBrowser", {
    bindings: {
       // onConfirm: "&"
    },
    templateUrl: "scripts/components/concept-detail/enrichment-browser/" +
        "enrichment-browser.html",

    // The controller that handles our component logic
    controller: function($scope, $routeParams, ConfigService, SearchService,
        VocabService, TooltipService, UserSettingsService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.searching = false;
            // limit for concepts shown in concepts tab
            $scope.conceptsLimit = ConfigService.conceptsLimit;
            $scope.showSearch = false; // ConfigService.showSearchOnStart;
            $scope.tooltips = TooltipService;
            ctrl.showEnrichments = UserSettingsService.showEnrichments;

            // get thesauri when label is available
            VocabService.get({id: $routeParams.vID}, function(vocab) {
                $scope.vocab = vocab;

                ctrl.getEnrichmentVocab(vocab);

                updateSearchThesauri();
            });
        };

        ctrl.$onDestroy = function() {
            UserSettingsService.showEnrichments = ctrl.showEnrichments;
        }

        ctrl.getEnrichmentVocab = function(vocab) {
            vocab.getEnrichmentVocab(function(enrichmentVocabID) {
                // get additional infos on enrichmentVocab
                VocabService.get({id: enrichmentVocabID}, function(enrichmentVocab) {
                    $scope.enrichmentVocab = enrichmentVocab;
                });

                // get concepts of vocab to be shown
                // LabelService.query({'vocab': vocab.id}, function(concepts) {
                //     scope.siblings = _.filter(concepts, function(o) {
                //         return o.id !== $routeParams.lID;  // skip current concept
                //     });
                // });
            });
        };

        // when searching, append search results
        // search when something is entered,
        // ls results are cached anyway, everything else gets searched on change
        $scope.onSearchClick = function() {
            $scope.resultBoxes = null;

            if (!$scope.searchValue) {  // stop when no search value entered
                return;
            }

            $scope.resultBoxes = [];
            $scope.searching = true;

            // search in all thesauri and append as soon as they're found!
            $scope.thesauri.forEach(function(thesaurus) {
                if (thesaurus.checked) {

                    SearchService.query({retcat: thesaurus.name, query: $scope.searchValue}, function(results) {

                        if (thesaurus.name === "Local Labeling System") {
                            results = _.filter(results, function(o) {
                                //console.log(o.scheme);
                                //console.log(scope.vocab.title);
                                return o.scheme !== $scope.vocab.title;  // skip same vocab concepts
                            });

                        } else if (thesaurus.name === "this." + $scope.vocab.id) {
                            results = _.filter(results, function(o) {
                                return o.uri.split("/").pop() !== $scope.label.id;  // skip current concept
                            });
                        }
                        //
                        $scope.searching = false;
                        $scope.resultBoxes = $.merge(scope.resultBoxes, results);
                    }, function error(res) {
                        console.log(res);
                    });
                }
            });
        };

        function updateSearchThesauri() {
            $scope.vocab.getThesauri(function(thesauri) {
                $scope.thesauri = thesauri;
                // reset search results
                if ($scope.searchValue) {
                    $scope.onSearchClick();
                }
            });
        }





        // $rootScope.$on("changedEnrichmentVocab", function(vocabID) {
        //     $scope.siblings = [];
        //     ctrl.getEnrichmentVocab(vocabID.id);
        // });

        // press "enter" to start search
        $scope.onSearchKeyPress = function(e) {
            if (e.keyCode === 13) {
                scope.onSearchClick();
            }
        };

        $scope.$on("changedThesauri", function() {
            updateSearchThesauri();
        });
    }
});
