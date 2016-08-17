'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module('labelsApp')
  .directive('searchResultBox', function () {
    return {
        templateUrl: "views/directive-search-result-box.html",
        restrict: 'E',
        scope: {
            data: "=",  // data attribute available as scope.data (two-way-binding)
            vocabulary: "=vocab"
        },
        link: function postLink(scope, element, attrs) {
            //scope.showMore = false;

            if (scope.data.type === "ls" && scope.data.scheme === scope.vocabulary.title.value) {  // ls same vocab
                scope.icon = "<span class='icon-label'></span>";
                scope.data.type = "label";

            } else if (scope.data.type === "ls" && scope.data.scheme !== scope.vocabulary.title.value) {  // ls other vocabs
                scope.icon = "(" + scope.data.type + ")";
            } else {
                scope.icon = "(" + scope.data.type + ")";
            }

            //console.log(scope.data.broaderTerms);
        }
    };
  });
