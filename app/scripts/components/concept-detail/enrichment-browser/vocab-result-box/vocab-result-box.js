'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module("labelsApp")
  .component("lsVocabResultBox", {
    bindings: {
        data: "=",
        onConfirm: "&"
    },
    templateUrl: "scripts/components/concept-detail/enrichment-browser/vocab-result-box/vocab-result-box.html",
    controller: function($scope, $routeParams, ngDialog, TooltipService, LabelService, ConfigService, AuthService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;

            // determine icon
            ctrl.cssType = ctrl.data.vocabID === $routeParams.vID ? "label" : "ls";

            angular.element(".nano").nanoScroller();
        };

        /**
         * Opens a type-specific dialog that shows the connection (relation)
         * options for each type to link to the label.
         */
        ctrl.openDialog = function() {
            ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/vocab-result-box/dialog.html',
                className: 'bigdialog',
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.getDetails = function() {
            ctrl.data.getDetails().then(function(details) {
                ctrl.conceptDetails = details;
                $scope.$apply();
            });
        };

        /**
         * Returns link to editor for own vocabularies and link to viewer for
         * other users vocabularies
         */
        ctrl.getLink = function() {
            if (ctrl.data.creator === AuthService.getUser().id) {
                return "#/editor/vocabularies/" + ctrl.data.vocabID + "/concepts/" + ctrl.data.id;
            } else {
                return "#/vocabularies/" + ctrl.data.vocabID + "/concepts/" + ctrl.data.id;
            }
        };

        /**
         * Watcher that updates nanoscroller when box is extended.
         */
        $scope.$watch("showMore", function() {
            angular.element(".nano").nanoScroller();
        });
    }
});
