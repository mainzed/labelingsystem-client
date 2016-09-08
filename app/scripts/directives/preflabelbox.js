'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('prefLabelBox', function ($routeParams, ngDialog, LabelService, AuthService) {
    return {
        templateUrl: "views/directives/prefLabel-box.html",
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
                    template: "views/dialogs/small-box-prefLabel.html",
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
        }
  };
});
