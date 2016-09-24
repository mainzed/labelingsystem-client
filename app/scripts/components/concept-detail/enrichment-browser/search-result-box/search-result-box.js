'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module('labelsApp')
  .directive('lsSearchResultBox', function (ngDialog, LabelService, ResourcesService) {
    return {
        templateUrl: "scripts/components/concept-detail/enrichment-browser/search-result-box/search-result-box.html",
        restrict: 'E',
        // scope: {
        //     data: "=",
        //     action: "&"  // call function when add confirmed
        // },
        link: function postLink(scope, element, attrs) {

            // workaround for global scope
            scope.data = scope.box;

            // TODO: check if same vocab! with isolated scope
            scope.isSameVocab = function() {
                return scope.data.id;
            };

            if (scope.isSameVocab()) {
                scope.data.type = "label";
            }

            /**
             * Opens a type-specific dialog that shows the connection (relation)
             * options for each type to link to the label.
             */
            scope.onClick = function() {
                ngDialog.open({
                    template: 'scripts/components/concept-detail/enrichment-browser/search-result-box/dialog.html',
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });
            };

            /**
             * Watcher that updates nanoscroller when box is extended.
             */
            scope.$watch("showMore", function() {
                $(".nano").nanoScroller();
            });

            // reload nanoscroller when directive rendered
            $(".nano").nanoScroller();
        }
    };
  });
