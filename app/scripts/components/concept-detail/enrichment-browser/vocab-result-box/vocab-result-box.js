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
    controller: ["$scope", "$rootScope", "$routeParams", "ngDialog", "TooltipService", "AuthService", function($scope, $rootScope, $routeParams, ngDialog, TooltipService, AuthService) {
        var ctrl = this;

        ctrl.dialog = null;
        ctrl.cssType = null;

        ctrl.$onInit = function() {
            //console.log(ctrl.data);
            $scope.tooltips = TooltipService;
            ctrl.setIcon(ctrl.data);
            angular.element(".nano").nanoScroller();
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

        ctrl.getDetails = function() {
            if (angular.isFunction(ctrl.data.getDetails)) {
                ctrl.data.getDetails().then(function(details) {
                    ctrl.conceptDetails = details;
                    $scope.$apply();
                });
            };
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

        ctrl.hasMore = function() {
            if (angular.isFunction(ctrl.data.hasMore)) {
                return ctrl.data.hasMore();
            } else {
                //console.log(ctrl.data);
                //angular.isObject(ctrl.data)
            }
        }

        ctrl.toggleMore = function() {
            $scope.showMore = !$scope.showMore;
            angular.element(".nano").nanoScroller();
        };

        /**
         * Watcher that updates nanoscroller when box is extended.
         */
        $scope.$watch("showMore", function() {
            angular.element(".nano").nanoScroller();
        });
    }]
});
