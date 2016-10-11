'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:listBox
 * @description
 * # listBox
 */
angular.module('labelsApp')
  .directive('lsListBox', function ($rootScope, $location, $routeParams, LabelService, ResourcesService, ConfigService, HelperService) {
    return {
        templateUrl: "scripts/components/concepts/list-box/list-box.html",
        restrict: 'E',
        scope: {
            concept: "=",
            mode: "@"
        },
        link: function postLink(scope) {

            /**
             * Shows the box's extension with additional information about the
             * specified concept.
             */
            scope.toggleExtension = function() {
                scope.showMore = !scope.showMore;
            };

            /**
             * Redirects to detail view of the specified concept.
             * @param {string} id - Concept ID
             */
            scope.onClick = function(id) {
                if (scope.mode === 'viewer') {
                    $location.path("/vocabularies/" + $routeParams.vID + "/concepts/" + id);
                } else {
                    $location.path("editor/vocabularies/" + $routeParams.vID + "/concepts/" + id);
                }

            };

            /**
             * Watcher that resets nanoscroll each time the extentAll property
             * changes (e.g. by a button click on "extent all").
             */
            scope.$parent.$watch("extendAll", function(newVal) {
                scope.showMore = newVal;
                $(".nano").nanoScroller();
            });//

            /**
             * checks if concept has broader concepts
             */
            scope.hasBroader = function(concept) {
                if (ConfigService.showMatches) {
                    return concept.broadMatch || concept.broader;
                } else {
                    return concept.broader;
                }
            };

            /**
             * checks if concept has narrower concepts
             */
            scope.hasNarrower = function(concept) {
                if (ConfigService.showMatches) {
                    return concept.narrowMatch || concept.narrower;
                } else {
                    return concept.narrower;
                }
            };


            /**
             * Watcher that resets nanoscroll each time a concept is extended
             * to show additional details.
             */
            scope.$watch("showMore", function(newValue) {
                //console.log("showMore");
                // get additional infos if showMore is true
                if (newValue && !scope.broaderTerms && !scope.narrowerConcepts) {

                    scope.broaderConcepts = [];
                    scope.narrowerConcepts = [];

                    // internal
                    HelperService.getRelatedConcepts(scope.concept, "broader", function(relatedConcepts) {
                        scope.broaderConcepts = scope.broaderConcepts.concat(relatedConcepts);
                    });
                    HelperService.getRelatedConcepts(scope.concept, "narrower", function(relatedConcepts) {
                        scope.narrowerConcepts = scope.narrowerConcepts.concat(relatedConcepts);
                        //console.log("add narrower to: " + scope.concept.prefLabels[0].value);
                    });

                    // external
                    if (ConfigService.showMatches) {
                        HelperService.getRelatedConcepts(scope.concept, "broadMatch", function(relatedConcepts) {
                            scope.broaderConcepts = scope.broaderConcepts.concat(relatedConcepts);
                        });
                        HelperService.getRelatedConcepts(scope.concept, "narrowMatch", function(relatedConcepts) {
                            scope.narrowerConcepts = scope.narrowerConcepts.concat(relatedConcepts);
                        });
                    }
                }

                // reset nanoscroll
                $(".nano").nanoScroller();
            });

        }
    };
});
