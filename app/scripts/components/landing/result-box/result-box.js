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
    controller: function ($scope, $location) {
        var ctrl = this;

        ctrl.$onInit = function () {
            $(".nano").nanoScroller();
        };

        ctrl.$onDestroy = function () {};

        ctrl.redirectToConcept = function() {
            $location.path("/vocabularies/" + ctrl.concept.vocabID + "/concepts/" + ctrl.concept.id);
        };

        ctrl.hasMore = function() {
            return ctrl.concept.description || ctrl.concept.hasBroader() || ctrl.concept.hasNarrower();
        }

        /**
         * Watcher that resets nanoscroll each time the extentAll property
         * changes (e.g. by a button click on "extent all").
         */
        $scope.$parent.$watch("extendAll", function(extendAll) {
            if (extendAll && ctrl.hasMore()) {
                $scope.showMore = extendAll;
            } else if (!extendAll && ctrl.hasMore()) {
                $scope.showMore = extendAll;
            }
            $(".nano").nanoScroller();
        });

    }
});
