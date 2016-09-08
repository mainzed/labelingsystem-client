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
        templateUrl: "views/directives/list-box.html",
        restrict: 'E',
        scope: {
            concept: "="
        },
        link: function postLink(scope) {

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
            scope.$parent.$watch("extentAll", function(newVal) {
                scope.showMore = newVal;
                $(".nano").nanoScroller();
            });//

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
