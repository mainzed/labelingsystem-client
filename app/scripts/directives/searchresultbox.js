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
        link: function postLink(scope, element, attrs) {

            // set icon
            if (scope.box.type === "ls" && scope.box.scheme === scope.vocabulary.title.value) {  // ls same vocab
                scope.icon = "<span class='icon-label'></span>";
                scope.box.type = "label";

            } else if (scope.box.type === "ls" && scope.box.scheme !== scope.vocabulary.title.value) {  // ls other vocabs
                scope.icon = "(" + scope.box.type + ")";
            } else {
                scope.icon = "(" + scope.box.type + ")";
            }


            // check if same vocab

        }
    };
  });
