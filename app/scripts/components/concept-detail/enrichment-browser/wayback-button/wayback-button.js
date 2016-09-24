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
    templateUrl: "scripts/components/concept-detail/enrichment-browser/wayback-button/wayback-button.html",

    // The controller that handles our component logic
    controller: function ($scope, ngDialog, WaybackService) {
        var ctrl = this;

        $scope.url = "";

        ctrl.openDialog = function() {
            ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/wayback-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.verifyLink = function(url) {
            //console.log("verify");
            WaybackService.get(url, function(uri) {
                //console.log("success");
                $scope.url = uri;
                ctrl.isValid = true;
            }, function(err) {
                console.log(err);
            });
        };
    }
});
