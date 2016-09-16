'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:linkBox
 * @description
 * # linkBox
 */
angular.module('labelsApp')
  .directive('linkBox', function (ngDialog, $routeParams, ResourcesService, LabelService, HelperService, AuthService) {
    return {
        templateUrl: 'scripts/components/label-details/wayback-box/wayback-box.html',
        restrict: 'E',
        scope: {
            data: "="
        },
        link: function postLink(scope, element) {
            // prefill data
            scope.resource = {
                label: "...",
                type: "wayback"
            };

            // get data
            ResourcesService.get(scope.data.uri, function(resource) {
                scope.resource = resource;
            });

            /**
             * Opens a dialog with detailed information.
             */
            scope.openDialog = function() {
                ngDialog.open({
                    template: "scripts/components/label-details/wayback-box/dialog.html",
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });
            };

            /**
             * Deletes the current wayback link.
             */
            scope.onDeleteClick = function() {
                // get current concept
                LabelService.get({id: $routeParams.lID}, function(concept) {

                    _.remove(concept.seeAlso, { "uri": scope.data.uri });

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
             * Open resource-url in new tab.
            */
            scope.openResource = function() {
                HelperService.openLinkInNewTab(scope.resource.uri);
            };
        }
    };
});
