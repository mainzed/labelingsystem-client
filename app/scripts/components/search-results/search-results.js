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
    controller: ["$scope", "CachingService", "HelperService", "ConfigService", function($scope, CachingService, HelperService, ConfigService) {

        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.resultsLimit = ConfigService.conceptsLimit;

            $scope.filterValue = CachingService.viewer.filterValue;
            ctrl.labels = CachingService.viewer.allConcepts;

            $scope.conceptOrder = '-lastModified'; 

            HelperService.refreshNanoScroller();
        };

        ctrl.$onDestroy = function() {
            CachingService.viewer.filterValue = $scope.filterValue;
        };

    }]
});
