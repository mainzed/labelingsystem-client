'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:linkBox
 * @description
 * # linkBox
 */
angular.module('labelsApp')
  .directive('linkBox', function($window, ngDialog, $routeParams, ResourcesService, LabelService, HelperService, AuthService) {
    return {
        templateUrl: 'scripts/components/concept-detail/wayback-box/wayback-box.html',
        restrict: 'E',
        scope: {
            data: "=",
            mode: "@"
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
                if (scope.mode === "viewer") {
                    $window.open(scope.data.uri, "_blank");

                } else {
                    ngDialog.open({
                        template: "scripts/components/concept-detail/wayback-box/dialog.html",
                        className: 'bigdialog smallheightdialog',
                        showClose: false,
                        closeByDocument: false,
                        disableAnimation: true,
                        scope: scope
                    });
                }

            };

            /**
             * Deletes the current wayback link.
             */
            scope.onDeleteClick = function() {
                // get current concept

                LabelService.get({id: $routeParams.lID}, function(concept) {

                    _.remove(concept.seeAlso, { "uri": scope.data.uri });

                    concept.save(function() {
                        element.remove(); // delete element from DOM

                    }, function error(res){
                        console.log(res);
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
