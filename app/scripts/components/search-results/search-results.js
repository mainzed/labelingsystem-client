'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:smallBox
* @description
* # smallBox
*/
angular.module('labelsApp')
  .component('lsSearchResults', {
    bindings: {},
    templateUrl: "scripts/components/search-results/search-results.html",
    controller: ["$scope", "$window", "CachingService", "HelperService", "ConfigService", "ConceptService", function($scope, $window, CachingService, HelperService, ConfigService, ConceptService) {

        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.resultsLimit = ConfigService.conceptsLimit;

            $scope.filterValue = CachingService.viewer.filterValue;
            $scope.conceptOrder = '-lastModified';

            $window.document.getElementById("labelSearch").focus();

            // get labels cache or load new
            if (CachingService.viewer.allConcepts) {  // already cached
                ctrl.labels = CachingService.viewer.allConcepts;
            } else {
                $scope.loading = true;
                $scope.placeholder = "loading labels";
                ConceptService.queryPublic(function(labels) {
                    ctrl.labels = labels;
                    $window.document.getElementById("labelSearch").focus();
                    $scope.placeholder = "search labels";
                    // save for later
                    CachingService.viewer.allConcepts = labels;
                    $scope.loading = false;
                });
            }
            HelperService.refreshNanoScroller();
        };

        ctrl.$onDestroy = function() {
            CachingService.viewer.filterValue = $scope.filterValue;
        };

        ctrl.toggleExtent = function() {
            $scope.extendAll = !$scope.extendAll;
        };

    }]
});
