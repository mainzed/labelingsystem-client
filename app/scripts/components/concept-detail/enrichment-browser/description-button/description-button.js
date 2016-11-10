'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsDescriptionButton', {
    bindings: {
        data: "=",
        onConfirm: "&"
    },
    templateUrl: "scripts/components/concept-detail/enrichment-browser/description-button/description-button.html",
    controller: ["$scope", "$rootScope", "ngDialog", "ConfigService", function($scope, $rootScope, ngDialog, ConfigService) {
        var ctrl = this;

        this.$onInit = function() {}

        // waits for async bindings and their changes
        this.$onChanges = function() {};

        this.openDialog = function() {
            ctrl.description = "";
            ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/description-button/dialog.html',
                className: 'bigdialog smallheightdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.addDescription = function(value) {
            $rootScope.$broadcast("addedDescription", { description: value });
        };

        $scope.onKeyPress = function(e) {
            if (ctrl.description.length > ConfigService.maxConceptDescriptionLength - 1) {
                // prevent new characters from being added
                e.preventDefault();
                // shorten description back to allowed length
                ctrl.description = ctrl.description.substring(0, ConfigService.maxConceptDescriptionLength);
            }
        };
    }]
});
