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
    controller: ["$scope", "$rootScope", "$routeParams", "ngDialog", "TooltipService", "AuthService", "HelperService", function($scope, $rootScope, $routeParams, ngDialog, TooltipService, AuthService, HelperService) {
        var ctrl = this;

        ctrl.dialog = null;
        ctrl.cssType = null;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;
            ctrl.setIcon(ctrl.data);
            HelperService.refreshNanoScroller();
        };

        ctrl.setIcon = function(data) {
            if (data.type) {
                ctrl.cssType = data.type;
            } else if (data.vocabID === $routeParams.vID) {
                ctrl.cssType = "label"
            } else {
                ctrl.cssType = "ls"
            }
        }

        /**
         * Opens a type-specific dialog that shows the connection (relation)
         * options for each type to link to the label.
         */
        ctrl.openDialog = function() {
            ctrl.dialog = ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/vocab-result-box/dialog.html',
                className: 'bigdialog',
                disableAnimation: true,
                scope: $scope
            });
        };

        /**
         * Returns link to editor for own vocabularies and link to viewer for
         * other users vocabularies
         */
        ctrl.getLink = function() {
            if (ctrl.data.id) {
                if (ctrl.data.creator === AuthService.getUser().id) {
                    return "#/editor/vocabularies/" + ctrl.data.vocabID + "/concepts/" + ctrl.data.id;
                } else {
                    return "#/vocabularies/" + ctrl.data.vocabID + "/concepts/" + ctrl.data.id;
                }
            } else {  // search result
                return ctrl.data.uri;
            }
        };

        ctrl.addConcept = function(relation) {
            $rootScope.$broadcast("addedResource", { concept: ctrl.data, relation: relation });
            ctrl.dialog.close();
        };

        ctrl.toggleMore = function() {
            $scope.showMore = !$scope.showMore;
            HelperService.refreshNanoScroller();
        };

    }]
});
