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
    controller: function ($scope, $document, ngDialog, WaybackService, TooltipService) {
        var ctrl = this;

        $scope.tooltips = TooltipService;

        ctrl.openDialog = function() {
            ctrl.url = "";
            ctrl.validUri = "";
            ctrl.processing = false;

            ctrl.dialog = ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/wayback-button/dialog.html',
                className: 'bigdialog smallheightdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.verifyLink = function(url) {
            ctrl.processing = true;
            WaybackService.get(url, function(uri) {
                ctrl.validUri = uri;
                $scope.validUri = uri;
            }, function(err) {
                ctrl.processing = false;
                console.log(err);
            });
        };

        // "enter" to verify
        $document.keydown(function(e) {
            if (ctrl.url && ctrl.url.length > 0 && !ctrl.processing && e.keyCode === 13) {  // enter to verify
                ctrl.verifyLink(ctrl.url);
            }
        });

        // "enter" to apply
        // $document.keydown(function(e) {
        //
        //     if (ctrl.validUri.length > 0 && e.keyCode === 13) {  // enter to apply
        //         ctrl.onConfirm({$uri: ctrl.validUri});
        //         ngDialog.closeAll();
        //     }
        //
        // });
    }
});
