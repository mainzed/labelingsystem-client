'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsWaybackButton', {
    bindings: {
        onConfirm: "&"
    },
    templateUrl: "scripts/components/label-details/enrichment-browser/wayback-button/wayback-button.html",

    // The controller that handles our component logic
    controller: function ($scope, ngDialog) {

        this.openDialog = function() {
            ngDialog.open({
                template: 'scripts/components/label-details/enrichment-browser/wayback-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };
    }
});
