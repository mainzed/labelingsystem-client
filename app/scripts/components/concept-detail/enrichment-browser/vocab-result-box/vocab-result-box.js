'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module('labelsApp')
  .directive('lsVocabResultBox', function (ngDialog) {
    return {
        templateUrl: "scripts/components/concept-detail/enrichment-browser/vocab-result-box/vocab-result-box.html",
        restrict: 'E',
        scope: {
            data: "=",
            onConfirm: "&"
        },
        link: function postLink(scope) {

            // scope.getConceptLabel = function(id) {
            //     return new Promise(function(resolve, reject) {
            //         LabelService.get({id: id}, function(concept) {
            //             console.log("inside");
            //             console.log(concept.getLabel());
            //             var label = concept.getLabel();
            //             resolve(label);
            //             //
            //         }, function error(res) {
            //             reject(res);
            //         });
            //     });
            //     //scope.broaderConcepts = scope.data.getRelatedConcepts("broader");
            // };
            scope.getInfo = function() {
                console.log("get info!");
                scope.data.getRelatedConcepts("broader").then(function(concepts) {
                    scope.broaderConcepts = concepts;
                });
                scope.narrowerConcepts = scope.data.getRelatedConcepts("narrower");

            };


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

            scope.getRelatedConcepts = function() {

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
