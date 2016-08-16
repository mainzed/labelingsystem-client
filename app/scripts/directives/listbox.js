'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:listBox
 * @description
 * # listBox
 */
angular.module('labelsApp')
  .directive('listBox', function () {
    return {
        templateUrl: "views/directive-list-box.html",
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            // get data for miniboxes
            scope.miniBoxes = [];

            // get attribtue boxes
            if (scope.label.scopeNote) {
                scope.miniBoxes.push({
                    category: "attribute",
                    type: "text"
                });
            }

            // add prefLabels to attributeBoxes
            if (scope.label.prefLabels) {
                scope.label.prefLabels.forEach(function() {
                    scope.miniBoxes.push({
                        category: "attribute",
                        type: "text"
                    });
                });
            }

            if (scope.label.altLabels) {
                scope.label.altLabels.forEach(function() {
                    scope.miniBoxes.push({
                        category: "attribute",
                        type: "text"
                    });
                });
            }

            // broader, broaderMatch
            // internal labels (white)
            if (scope.label.broader) {
                scope.label.broader.forEach(function() {
                    scope.miniBoxes.push({
                        category: "broader",
                        type: "label"
                    });
                });
            }

            if (scope.label.narrower) {
                scope.label.narrower.forEach(function() {
                    scope.miniBoxes.push({
                        category: "narrower",
                        type: "label"
                    });
                });
            }

            if (scope.label.related) {
                scope.label.related.forEach(function() {
                    scope.miniBoxes.push({
                        category: "related",
                        type: "label"
                    });
                });
            }

            if (scope.label.narrowMatch) {
                scope.label.narrowMatch.forEach(function(match) {
                    scope.miniBoxes.push({
                        category: "narrowMatch",
                        type: match.type
                    });
                });
            }

            if (scope.label.broadMatch) {
                scope.label.broadMatch.forEach(function(match) {
                    scope.miniBoxes.push({
                        category: "broadMatch",
                        type: match.type
                    });
                });
            }

            if (scope.label.exactMatch) {
                scope.label.exactMatch.forEach(function(match) {
                    //console.log(match);
                    scope.miniBoxes.push({
                        category: "exactMatch",
                        type: match.type
                    });
                });
            }

            if (scope.label.closeMatch) {
                scope.label.closeMatch.forEach(function(match) {
                    scope.miniBoxes.push({
                        category: "closeMatch",
                        type: match.type
                    });
                });
            }

            if (scope.label.relatedMatch) {
                scope.label.relatedMatch.forEach(function(match) {
                    scope.miniBoxes.push({
                        category: "relatedMatch",
                        type: match.type
                    });
                });
            }

            if (scope.label.seeAlso) {
                scope.label.seeAlso.forEach(function(match) {
                    scope.miniBoxes.push({
                        category: "seeAlso",
                        type: match.type
                    });
                });
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
