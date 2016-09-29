'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsCreateConceptButton', {
    bindings: {
        onConfirm: "&"
    },
    template: '<span class="plusposition" ng-click="$ctrl.openDialog()">+</span>',
    controller: function ($scope, ngDialog, ConfigService) {
        var ctrl = this;
        this.openDialog = function() {

            ctrl.newConcept = {
                thumbnail: "",
                description: ""
            };

            ngDialog.open({
                template: 'scripts/components/concepts/create-concept-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

        $scope.onKeyPress = function(e) {
            if (ctrl.newConcept.description.length > ConfigService.conceptDescriptionLength - 1) {
                // prevent new characters from being added
                e.preventDefault();
                // shorten description back to allowed length
                ctrl.newConcept.description = ctrl.newConcept.description.substring(0, ConfigService.conceptDescriptionLength);
            }
        };
    }
});
