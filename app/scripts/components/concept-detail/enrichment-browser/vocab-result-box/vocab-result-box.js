"use strict";

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
    controller: ["$scope", "$rootScope", "$routeParams", "ngDialog", "TooltipService", "AuthService", "HelperService", "CachingService", function($scope, $rootScope, $routeParams, ngDialog, TooltipService, AuthService, HelperService, CachingService) {
        var ctrl = this;

        ctrl.dialog = null;
        ctrl.cssType = null;
        ctrl.isEnriched = false;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;
            ctrl.setIcon(ctrl.data);
            ctrl.isEnriched = ctrl.hasEnrichment();
            HelperService.refreshNanoScroller();
        };

        // hide concepts already enriched with the given concept
        ctrl.hasEnrichment = function() {
            var parentID = $routeParams.lID;
            return _.includes(ctrl.data["broader"], parentID) || _.includes(ctrl.data["related"], parentID) || _.includes(ctrl.data["narrower"], parentID);
        };

        ctrl.isSameVocab = function() {
            return ctrl.data.vocabID === $routeParams.vID || ctrl.data.scheme === CachingService.editor.vocab.title;
        };

        ctrl.setIcon = function(data) {
            if (ctrl.isSameVocab()) {
                ctrl.cssType = "label";
            } else if (data.type) {
                ctrl.cssType = data.type;
            } else {
                ctrl.cssType = "ls";
            }
        };

        /**
         * Opens a type-specific dialog that shows the connection (relation)
         * options for each type to link to the label.
         */
        ctrl.openDialog = function() {
            ctrl.dialog = ngDialog.open({
                template: "scripts/components/concept-detail/enrichment-browser/vocab-result-box/dialog.html",
                className: "bigdialog",
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
            ctrl.isEnriched = true;
            $scope.showMore = false;
            ctrl.dialog.close();
        };

        ctrl.toggleMore = function() {
            $scope.showMore = !$scope.showMore;
            HelperService.refreshNanoScroller();
        };

        // listen if this concept is removed from parent and therefore available again
        $scope.$on("removedConcept", function(event, data) {
            // temporarily remove from concept and check again
            _.pull(ctrl.data[data.relation], data.conceptID);
            ctrl.isEnriched = ctrl.hasEnrichment();
        });
    }]
});
