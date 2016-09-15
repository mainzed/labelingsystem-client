'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:descriptionBox
 * @description
 * # descriptionBox
 */
angular.module('labelsApp')
  .directive('descriptionBox', function ($routeParams, $rootScope, ngDialog, LabelService, AuthService) {
    return {
        templateUrl: 'views/directives/description-box.html',
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
                    template: "views/dialogs/small-box-description.html",
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

                    // replace old scopeNote
                    delete concept.scopeNote;

                    // send updated label to server
                    var jsonObject = {
                        item: concept,
                        user: AuthService.getUser().name
                    };

                    LabelService.update({id: $routeParams.lID}, jsonObject, function() {
                        // delete element from DOM
                        element.remove();
                        $rootScope.$broadcast('removed-description');

                    }, function(err) {
                        console.log(err);
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
                    concept.scopeNote.value = newValue;

                    // send updated label to server
                    var jsonObject = {
                        item: concept,
                        user: AuthService.getUser().name
                    };

                    LabelService.update({id: $routeParams.lID}, jsonObject, function() {
                        // temporarily update element from DOM
                        scope.data.value = newValue;

                    }, function(err) {
                        console.log(err);
                    });


                });



            };
        }
    };
});
