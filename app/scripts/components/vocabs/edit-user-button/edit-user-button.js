'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsEditUserButton', {
    bindings: {
    },
    template: "<span></span>",

    controller: function ($scope, ngDialog) {
        var ctrl = this;

        ctrl.openUserDialog = function() {
            ngDialog.open({
                template: 'scripts/components/shared/footer/edit-user-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

    }
});
