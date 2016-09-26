'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('lsTranslationBox', function ($routeParams, $document, ngDialog, VocabService, LabelService, AuthService, ConfigService) {
    return {
        templateUrl: "scripts/components/concept-detail/translation-box/translation-box.html",
        restrict: 'E',
        scope: {
            data: "="
        },
        link: function postLink(scope, element) {

            /**
             * Opens a dialog with detailed information.
             */
            scope.openDialog = function() {
                ngDialog.open({
                    template: "scripts/components/concept-detail/translation-box/dialog.html",
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });
            };

            /**
             * Deletes the current prefLabel.
             */
            scope.onDeleteClick = function() {
                // get current concept
                LabelService.get({id: $routeParams.lID}, function(concept) {

                    // remove current prefLabel
                    concept.prefLabels = _.filter(concept.prefLabels, function(o) {
                        return o.value !== scope.data.value && o.lang !== scope.data.value;
                    });

                    // save to server
                    concept.save(function() {
                        // delete element from DOM
                        element.remove();

                    }, function error(res) {
                        console.log(res);
                    });
                });
            };

            /**
             * Updates the current prefLabel with a newer term.
             * @param {string} newValue - updated term text
             */
            scope.updateTranslation = function(newValue) {

                // get current concept
                LabelService.get({id: $routeParams.lID}, function(concept) {

                    // get old prefLabel and remove it from concept
                    var oldPrefLabel = _.find(concept.prefLabels, {
                        "value": scope.data.value,
                        "lang": scope.data.lang,
                        "isThumbnail": scope.data.isThumbnail
                    });
                    concept.prefLabels = _.filter(concept.prefLabels, function(o) {
                        return o.value !== scope.data.value && o.lang !== scope.data.lang;
                    });

                    // insert updated prefLabel
                    var updatedPrefLabel = oldPrefLabel;
                    updatedPrefLabel.value = newValue;
                    concept.prefLabels.push(updatedPrefLabel);

                    concept.save(function() {
                        // temporarily update current element
                        scope.data.value = newValue;

                    }, function error(res) {
                        console.log(res);
                    });
                });
            };

        }
    };
});
