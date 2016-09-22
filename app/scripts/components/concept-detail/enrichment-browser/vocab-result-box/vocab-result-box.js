'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module('labelsApp')
  .directive('lsVocabResultBox', function (ngDialog, LabelService, ResourcesService) {
    return {
        templateUrl: "scripts/components/concept-detail/enrichment-browser/vocab-result-box/vocab-result-box.html",
        restrict: 'E',
        // scope: {
        //     data: "="
        // },
        link: function postLink(scope) {

            // TODO: workaround for isolated scope
            scope.data = scope.label;
            /**
             * Opens a type-specific dialog that shows the connection (relation)
             * options for each type to link to the label.
             */
            scope.openDialog = function() {
                ngDialog.open({
                    template: 'scripts/components/concept-detail/enrichment-browser/vocab-result-box/dialog.html',
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
