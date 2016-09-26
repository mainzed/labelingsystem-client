'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:vocabBox
* @description
* # vocabBox
*/
angular.module('labelsApp')

.component('lsEditLabelButton', {
    bindings: {
        data: "=",
    },
    template: '<span class="icon-more icon" ng-click="$ctrl.openDialog()"></span>',
    controller: function ($scope, ngDialog) {
        var ctrl = this;

        /**
         * Opens the metadata/settings dialog of a vocabulary.
         */
        this.openDialog = function() {
            $scope.label = ctrl.data;
            ngDialog.open({
                template: 'scripts/components/shared/edit-label-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };
    }

});
