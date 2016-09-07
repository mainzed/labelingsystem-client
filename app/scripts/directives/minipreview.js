'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:miniPreview
 * @description
 * # miniPreview
 */
angular.module('labelsApp')
  .directive('miniPreview', function () {
    return {
        templateUrl: 'views/directives/mini-preview.html',
        restrict: 'E',
        scope: {
            label: "=",  // uni-directional
            size: "@size"
        },
        link: function postLink(scope, element, attrs) {

            scope.size = scope.size || "mini";

            var attributes = ["prefLabels", "altLabels"];
            var relations = ["broader", "narrower", "related"];
            var matchTypes = ["narrowMatch", "broadMatch", "exactMatch", "closeMatch", "relatedMatch", "seeAlso"];

            // get data for miniboxes
            scope.miniBoxes = [];

            if (scope.label) {
                attributes.forEach(function(attr) {
                    getAttribute(attr);
                });

                relations.forEach(function(relation) {
                    getRelation(relation);
                });

                matchTypes.forEach(function(matchType) {
                    getMatch(matchType);
                });

                // get scopeNote
                if (scope.label.scopeNote) {
                    scope.miniBoxes.push({
                        category: "attribute",
                        type: "text"
                    });
                }
            }


            function getAttribute(attr) {
                if (scope.label[attr]) {
                    scope.label[attr].forEach(function() {
                        scope.miniBoxes.push({
                            category: "attribute",
                            type: "text"
                        });
                    });
                }
            }

            function getRelation(relation) {
                if (scope.label[relation]) {
                    scope.label[relation].forEach(function() {
                        scope.miniBoxes.push({
                            category: relation,
                            type: "label"
                        });
                    });
                }
            }

            function getMatch(matchType) {
                if (scope.label[matchType]) {
                    scope.label[matchType].forEach(function(match) {
                        scope.miniBoxes.push({
                            category: matchType,
                            type: match.type
                        });
                    });
                }
            }

            // filters
            scope.attributeFilter = function(box) {
                return box.category === "attribute";
            };

            scope.broaderFilter = function(box) {
                return box.category === "broader" || box.category === "broadMatch";
            };

            scope.narrowerFilter = function(box) {
                return box.category === "narrower" || box.category === "narrowMatch";
            };

            scope.relatedFilter = function(box) {
                return box.category === "related" || box.category === "closeMatch" || box.category === "relatedMatch" || box.category === "exactMatch" || box.category === "seeAlso";
            };
        }
    };
  });
