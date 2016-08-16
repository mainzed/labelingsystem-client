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

            if (scope.label.narrowMatch) {
                scope.label.narrowMatch.forEach(function(match) {
                    console.log(match);
                    // scope.miniBoxes.push({
                    //     category: "narrower",
                    //     type: "label"
                    // });
                });
            }

            if (scope.label.broadMatch) {
                scope.label.broadMatch.forEach(function(match) {
                    console.log(match);
                    // scope.miniBoxes.push({
                    //     category: "narrower",
                    //     type: "label"
                    // });
                });
            }
            console.log(scope.label);


            //console.log(scope.miniBoxes);

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

            //console.log(scope.label.broader);

        }
    };
  });
