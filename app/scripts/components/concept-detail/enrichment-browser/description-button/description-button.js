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

    // The controller that handles our component logic
    controller: function ($scope, $rootScope, ngDialog) {

        this.openDialog = function() {
            ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/description-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };
    }
});
