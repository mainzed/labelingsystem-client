
angular.module("labelsApp")
 .component("lsHistoryButton", {
    bindings: {
        revisions: "="
    },
    template: "<span ng-click='$ctrl.openDialog()' class='icon-time'></span>",
    controller: ["$scope", "ngDialog", function($scope, ngDialog) {
        var ctrl = this;

        this.$onInit = function() {};

        /**
         * Opens a dialog with detailed information.
         */
        this.openDialog = function() {

            ctrl.dialog = ngDialog.open({
                template: "scripts/components/concept-detail/history-button/dialog.html",
                className: 'bigdialog',
                disableAnimation: true,
                scope: $scope
            });

        };
    }]
});
