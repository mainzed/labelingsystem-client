'use strict';

'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsResourceBox', {
    bindings: {
        data: "=",  // concept ID
        relation: "@",  // "related", "broader", "narrower"
        mode: "@"
    },
    templateUrl: "scripts/components/concept-detail/resource-box/resource-box.html",

    controller: ["$scope", "$rootScope", "$timeout", "$window", "ngDialog", "ConceptService", "$routeParams", "ResourcesService", "HelperService", function($scope, $rootScope, $timeout, $window, ngDialog, ConceptService, $routeParams, ResourcesService, HelperService) {

        var ctrl = this;

        ctrl.resource = null;
        ctrl.dialog = null;
        ctrl.newRelation;

        ctrl.$onInit = function(params) {
             // temporary
            ctrl.resource = {
                label: "...",
                type: ctrl.data.type
            };

            // get resource data from uri
            ResourcesService.get(ctrl.data.uri, function(resource) {
                ctrl.resource = resource;
            });

            // determine relation icon
            if (ctrl.relation === "closeMatch") {
                ctrl.relationIcon = "<span class='icon-close'></span>";
            } else if (ctrl.relation === "exactMatch") {
                ctrl.relationIcon = "<span title='exact Match' class='icon-exact'></span>";
            } else if (ctrl.relation === "relatedMatch") {
                ctrl.relationIcon = "<span class='icon-arrow'></span>";
            }
        };

        /**
         * Opens a dialog with detailed information.
         */
        ctrl.openDialog = function() {
            //console.log(ctrl.mode);
            if (ctrl.mode === "viewer") {
                $window.open(ctrl.data.uri, "_blank");

            } else {
                ctrl.newRelation = ctrl.relation;

                ctrl.dialog = ngDialog.open({
                    template: "scripts/components/concept-detail/resource-box/dialog.html",
                    className: 'bigdialog',
                    disableAnimation: true,
                    scope: $scope
                });
            }
        };

        $scope.$on('ngDialog.closed', function (e, $dialog) {
            if (ctrl.dialog && ctrl.dialog.id === $dialog.attr('id')) {  // is the resource dialog
                if (ctrl.newRelation !== ctrl.relation) {
                    $rootScope.$broadcast("changedRelation", {
                        newRelation: ctrl.newRelation,
                        oldRelation: ctrl.relation,
                        resource: ctrl.resource
                    });
                }
            }
        });

        /**
         * Deletes the selected resource, description, prefLabel or altLabel.
        */
        $scope.onDeleteClick = function() {
            $rootScope.$broadcast("removedResource", {
                relation: ctrl.relation,
                resourceURI: ctrl.resource.uri
            });
        };

        /**
         * Open resource-url in new tab.
        */
        ctrl.openResource = function() {
            $window.open($scope.resource.uri, "_blank");
        };

    }]
});
