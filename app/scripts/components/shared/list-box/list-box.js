"use strict";

/**
* @ngdoc directive
* @name labelsApp.directive:lsListBox
* @description
* # vocabBox
*/
angular.module("labelsApp")
.component("lsListBox", {
    bindings: {
        concept: "=",
        mode: "@"
    },
    templateUrl: "scripts/components/shared/list-box/list-box.html",
    controller: ["$scope", "$location", "$routeParams", "HelperService", function($scope, $location, $routeParams, HelperService) {
        var ctrl = this;

        ctrl.conceptDetails = null;

        ctrl.$onInit = function() {};

        /**
         * Shows the box"s extension with additional information about the
         * specified concept.
         */
        $scope.toggleExtension = function() {
            $scope.showMore = !$scope.showMore;
        };

        /**
        * Redirects to detail view of the specified concept.
        */
        ctrl.onClick = function() {
            console.log(ctrl.mode);
            if (ctrl.mode === "viewer") {
                $location.path("vocabularies/" + ctrl.concept.vocabID + "/concepts/" + ctrl.concept.id);
            } else {
                $location.path("editor/vocabularies/" + ctrl.concept.vocabID + "/concepts/" + ctrl.concept.id);
            }
        };

        /**
         * Watcher that resets nanoscroll each time the extentAll property
         * changes (e.g. by a button click on "extent all").
         */
        $scope.$parent.$watch("extendAll", function(extendAll) {
            if (extendAll && ctrl.concept.hasMore()) {
                $scope.showMore = extendAll;
            } else if (!extendAll && ctrl.concept.hasMore()) {
                $scope.showMore = extendAll;
            }
            HelperService.refreshNanoScroller();
        });

        /**
         * Watcher that resets nanoscroll each time a concept is extended
         * to show additional details.
         */
        $scope.$watch("showMore", function(showMore) {
            if (ctrl.concept && showMore) {
                ctrl.concept.getDetails().then(function(conceptDetails) {
                    ctrl.conceptDetails = conceptDetails;
                    // scope.$apply();
                    HelperService.refreshNanoScroller();
                });
            }
        });
    }]
});
