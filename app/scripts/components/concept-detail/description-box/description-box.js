'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:descriptionBox
 * @description
 * # descriptionBox
 */
angular.module('labelsApp')
  .directive('lsDescriptionBox', function ($routeParams, $rootScope, ngDialog, LabelService, TooltipService, ConfigService) {
    return {
        templateUrl: 'scripts/components/concept-detail/description-box/description-box.html',
        restrict: 'E',
        scope: {
            data: "=",
            mode: "@"
        },
        link: function postLink(scope, element) {

            scope.tooltips = TooltipService;

            /**
             * Opens a dialog with detailed information.
             */
            scope.openDialog = function() {
                if (scope.mode !== "viewer") {
                    scope.newValue = scope.data.description;
                    ngDialog.open({
                        template: "scripts/components/concept-detail/description-box/dialog.html",
                        className: 'bigdialog',
                        showClose: false,
                        closeByDocument: false,
                        disableAnimation: true,
                        scope: scope
                    });
                }
            };

            /**
             * Deletes the current prefLabel.
             */
            scope.onDeleteClick = function() {
                // get current concept
                LabelService.get({id: $routeParams.lID}, function(concept) {
                    delete concept.description;

                    concept.save(function() {
                        //element.remove();
                        $rootScope.$broadcast('removedDescription');
                    }, function error(res) {
                        console.log(res);
                    });
                });
            };

            /**
             * Updates the label description.
             * @param {string} newValue - updated term text
             */
            scope.updateDescription = function(newValue) {

                LabelService.get({id: $routeParams.lID}, function(concept) {

                    // replace old scopeNote
                    concept.description = newValue;

                    concept.save(function() {
                        scope.data.description = newValue;
                    }, function error(res) {
                        console.log(res);
                    });
                });
            };

            scope.onKeyPress = function(e, newValue) {
                //console.log(newValue.length);
                if (newValue.length > ConfigService.conceptDescriptionLength - 1) {
                    // prevent new characters from being added
                    e.preventDefault();
                    // shorten description back to allowed length
                    scope.newValue = newValue.substring(0, ConfigService.conceptDescriptionLength);
                }
            };
        }
    };
});
