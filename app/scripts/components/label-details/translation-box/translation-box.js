'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('lsTranslationBox', function ($routeParams, ngDialog, VocabService, LabelService, AuthService, ConfigService) {
    return {
        templateUrl: "scripts/components/label-details/translation-box/translation-box.html",
        restrict: 'E',
        scope: {
            data: "="
        },
        link: function postLink(scope, element) {

            // check if public thumbnail if this option is true
            if (ConfigService.preventThumbnailEdit) {
                // check if the current concept's vocab is public
                VocabService.get({id: $routeParams.vID}, function(vocab) {
                    if (scope.data.isThumbnail && vocab.releaseType === "public") {
                        scope.isPublicThumbnail = true;
                    }
                }, function(err) {
                    console.log(err);
                });
            }

            /**
             * Opens a dialog with detailed information.
             */
            scope.openDialog = function() {
                ngDialog.open({
                    template: "scripts/components/label-details/translation-box/dialog.html",
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

                    // send updated label to server
                    var jsonObject = {
                        item: concept,
                        user: AuthService.getUser().name
                    };

                    LabelService.update({id: $routeParams.lID}, jsonObject, function() {
                        // delete element from DOM
                        element.remove();

                    }, function(err) {
                        console.log(err);
                    });
                });
            };

            /**
             * Updates the current prefLabel with a newer term.
             * @param {string} newValue - updated term text
             */
            scope.updateLabel = function(newValue) {

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

                    // send updated label to server
                    var jsonObject = {
                        item: concept,
                        user: AuthService.getUser().name
                    };

                    LabelService.update({id: $routeParams.lID}, jsonObject, function() {
                        // temporarily update current element
                        scope.data.value = newValue;

                    }, function(err) {
                        console.log(err);
                    });
                });
            };

        }
    };
});
