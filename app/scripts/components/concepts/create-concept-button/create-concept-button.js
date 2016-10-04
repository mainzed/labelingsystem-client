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

        $scope.titleLength = ConfigService.conceptLabelLength;
        $scope.descriptionLength = ConfigService.conceptDescriptionLength;
    }
});
