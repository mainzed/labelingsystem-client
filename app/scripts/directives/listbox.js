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

            scope.gotInfos = false;

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
            scope.$watch("extentAll", function() {
                scope.showMore = scope.extentAll;
                $(".nano").nanoScroller();
            });//

            /**
             * Watcher that resets nanoscroll each time a concept is extended
             * to show additional details.
             */
            scope.$watch("showMore", function(newValue) {
                // get additional infos if showMore is true
                if (newValue && !scope.broaderTerms && !scope.narrowerConcepts) {

                    scope.broaderConcepts = [];
                    scope.narrowerConcepts = [];

                    // internal
                    if (scope.concept.broader) {
                        scope.concept.broader.forEach(function(broaderConceptID) {
                            LabelService.get({id: broaderConceptID}, function(concept) {
                                scope.broaderConcepts.push(concept);
                            });
                        });
                    }
                    // external
                    if (ConfigService.showMatches && scope.concept.broadMatch) {
                        scope.concept.broadMatch.forEach(function(broadMatch) {
                            ResourcesService.get(broadMatch.uri, function(match) {
                                scope.broaderConcepts.push(match);
                            });
                        });
                    }

                    // internal
                    if (ConfigService.showMatches && scope.concept.narrower) {
                        scope.concept.narrower.forEach(function(narrowerConceptID) {
                            LabelService.get({id: narrowerConceptID}, function(concept) {
                                scope.narrowerConcepts.push(concept);
                            });
                        });
                    }

                    // external
                    if (scope.concept.narrowMatch) {
                        scope.concept.narrowMatch.forEach(function(narrowMatch) {
                            ResourcesService.get(narrowMatch.uri, function(match) {
                                scope.narrowerConcepts.push(match);
                            });
                        });
                    }

                }
                // reset nanoscroll
                $(".nano").nanoScroller();
            });

        }
    };
  });
