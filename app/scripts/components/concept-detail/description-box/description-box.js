"use strict";

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module("labelsApp")
.component("lsDescriptionBox", {
    bindings: {
        data: "=",
        mode: "@"
    },
    templateUrl: "scripts/components/concept-detail/description-box/description-box.html",

    controller: ["$scope", "$routeParams", "$rootScope", "ngDialog", "ConceptService", "TooltipService", "ConfigService", function($scope, $routeParams, $rootScope, ngDialog, ConceptService, TooltipService, ConfigService) {
        var ctrl = this;

        ctrl.tooltips = null;
        ctrl.newValue = null;

        ctrl.$onInit = function() {
            ctrl.tooltips = TooltipService;
        };

        /**
         * Opens a dialog with detailed information.
         */
        ctrl.openDialog = function() {
            if (ctrl.mode !== "viewer") {
                ctrl.newValue = ctrl.data.description;
                ctrl.dialog = ngDialog.open({
                    template: "scripts/components/concept-detail/description-box/dialog.html",
                    className: "bigdialog smallheightdialog",
                    disableAnimation: true,
                    scope: $scope
                });
            }
        };

        /**
         * Deletes the current prefLabel.
         */
        ctrl.delete = function() {
            $rootScope.$broadcast("removedDescription");
            ctrl.isDeleted = true;
            ctrl.dialog.close();
        };

        ctrl.onKeyPress = function(e, newValue) {
            // console.log(newValue.length);
            if (newValue.length > ConfigService.maxConceptDescriptionLength - 1) {
                // prevent new characters from being added
                e.preventDefault();
                // shorten description back to allowed length
                ctrl.newValue = newValue.substring(0, ConfigService.maxConceptDescriptionLength);
            }
        };

        $scope.$on("ngDialog.closed", function(e, $dialog) {
            if (ctrl.dialog && ctrl.dialog.id === $dialog.attr("id")) {  // is the resource dialog
                if (ctrl.newValue && !ctrl.isDeleted) {
                    $rootScope.$broadcast("changedDescription", { newDescription: ctrl.newValue });
                }
            }
        });
    }]
});
