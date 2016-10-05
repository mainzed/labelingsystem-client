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
    controller: function ($scope, $document, ngDialog, ConfigService) {
        var ctrl = this;
        this.openDialog = function() {

            ctrl.newConcept = {
                thumbnail: "",
                description: ""
            };

            ctrl.dialog = ngDialog.open({
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

        // hotkeys
        $document.keydown(function(e) {
            if (ctrl.dialog && e.keyCode === 13 && !ctrl.conceptForm.$invalid) {  // enter
                ctrl.onConfirm({$newConcept: ctrl.newConcept});
                ctrl.dialog.close();
            }
        });
    }
});
