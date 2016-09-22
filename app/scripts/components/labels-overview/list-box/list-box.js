'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:listBox
 * @description
 * # listBox
 */
angular.module('labelsApp')
  .directive('listBox', function ($location, $routeParams, LabelService, ResourcesService, ConfigService, HelperService) {
    return {
        templateUrl: "scripts/components/labels-overview/list-box/list-box.html",
        restrict: 'E',
        scope: {
            concept: "="
        },
        link: function postLink(scope) {
            //console.log(scope.concept);

            /**
             * Shows the box's extension with additional information about the
             * specified concept.
             */
            scope.toggleExtension = function() {
                scope.showMore = !scope.showMore;
            };

            scope.getTerm = function(obj) {
                return HelperService.getTerm(obj);
            };

            /**
             * Redirects to detail view of the specified concept.
             * @param {string} id - Concept ID
             */
            scope.onClick = function(id) {
                $location.path("admin/vocabularies/" + $routeParams.vID + "/concepts/" + id);
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
