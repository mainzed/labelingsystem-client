'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('lsTranslationBox', function ($routeParams, $document, ngDialog, VocabService, TooltipService, LabelService, AuthService, ConfigService) {
    return {
        templateUrl: "scripts/components/concept-detail/translation-box/translation-box.html",
        restrict: 'E',
        scope: {
            data: "="
        },
        link: function postLink(scope, element) {

            scope.tooltips = TooltipService;
            
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

                    _.remove(concept.translations, { value: scope.data.value, lang: scope.data.lang });

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

                    // find and replace
                    var index = _.indexOf(concept.translations, _.find(concept.translations, { value: scope.data.value, lang: scope.data.lang}));
                    concept.translations.splice(index, 1, {value: newValue, lang: scope.data.lang});

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
