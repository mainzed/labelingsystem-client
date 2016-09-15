'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('altLabelBox', function ($routeParams, ngDialog, LabelService, AuthService) {
    return {
        templateUrl: "views/directives/altLabel-box.html",
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
                    template: "views/dialogs/small-box-altLabel.html",
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
                    concept.altLabels = _.filter(concept.altLabels, function(o) {
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
                    var oldLabel = _.find(concept.altLabels, {
                        "value": scope.data.value,
                        "lang": scope.data.lang
                    });
                    concept.altLabels = _.filter(concept.altLabels, function(o) {
                        return o.value !== scope.data.value && o.lang !== scope.data.lang;
                    });

                    // insert updated prefLabel
                    var updatedLabel = oldLabel;
                    updatedLabel.value = newValue;
                    concept.altLabels.push(updatedLabel);

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
