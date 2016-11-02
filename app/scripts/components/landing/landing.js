'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:smallBox
* @description
* # smallBox
*/
angular.module('labelsApp')
  .component('lsLanding', {
    bindings: {},
    templateUrl: "scripts/components/landing/landing.html",
    controller: ["$scope", "$window", "$timeout", "LabelService", "CachingService", "ConfigService", function($scope, $window, $timeout, LabelService, CachingService, ConfigService) {

        var ctrl = this;

        ctrl.$onInit = function() {

            //ctrl.resultsLimit = 0;
            ctrl.resultsLimit = ConfigService.conceptsLimit;
            $scope.extendAll = CachingService.toggles.extendAll || false;
            $scope.conceptOrder = '-lastModified'; 

            $scope.loading = false;
            // get from cache or load new
            if (CachingService.viewer.allConcepts) {  // already cached
                $scope.labels = CachingService.viewer.allConcepts;
            } else {
                $scope.loading = true;
                LabelService.queryPublic(function(labels) {
                    $scope.labels = labels;

                    // save for later
                    CachingService.viewer.allConcepts = labels;
                    $scope.loading = false;
                });
            }

            angular.element(".nano").nanoScroller();
        };

        ctrl.$onDestroy = function() {
            CachingService.viewer.filterValue = $scope.filterValue;
        };

        ctrl.toggleExtent = function() {
            $scope.extendAll = !$scope.extendAll;
        };

        /**
         * Order function for the use with the ng-repeat directive. Grades a label
         * by how many connections it has to internal or external resources.
         * @param {object} concept
         * @returns {number}
         */
        ctrl.orderByQuality = function(concept) {
            return -1 * concept.getScore();
        };

        // focus when loading complete
        $scope.$watch("loading", function(loading) {
            if (loading) {
                $scope.placeholder = "loading labels ...";
            } else {
                $timeout(function() {
                    $scope.placeholder = "search labels";
                    $window.document.getElementById("labelSearch").focus();
                }, 0);
            }
        });

        $scope.highlightResult = function(labelName, search) {
            if (labelName) {
                var re = new RegExp(search, "i");  // gi makes it case insensitive
                var match = labelName.match(re);  // find case sensitive to replace
                return labelName.replace(re, '<span class="highlight">' + match + '</span>');
            } else {
                return false;
            }
        };
    }]
});
