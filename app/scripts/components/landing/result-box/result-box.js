'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsResultBox', {
    bindings: {
        concept: "="
    },
    templateUrl: "scripts/components/landing/result-box/result-box.html",
    controller: function ($scope, $location, HelperService) {
        var ctrl = this;

        ctrl.conceptDetails = null;

        ctrl.$onInit = function () {
            HelperService.refreshNanoScroller();
            //$(".nano").nanoScroller();
        };

        ctrl.$onDestroy = function () {};

        /**
         * Watcher that resets nanoscroll each time a concept is extended
         * to show additional details.
         */
        $scope.$watch("showMore", function(showMore) {
            if (ctrl.concept && showMore) {
                ctrl.concept.getDetails().then(function(conceptDetails) {
                    ctrl.conceptDetails = conceptDetails;
                    $scope.$apply();
                });
            }
            angular.element(".nano").nanoScroller();
       });

        ctrl.redirectToConcept = function() {
            $location.path("/vocabularies/" + ctrl.concept.vocabID + "/concepts/" + ctrl.concept.id);
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
            angular.element(".nano").nanoScroller();
        });
    }
});
