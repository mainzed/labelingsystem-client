'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:vocabBox
* @description
* # vocabBox
*/
angular.module('labelsApp')

.component('lsOrderDropdown', {
    bindings: {
        order: "="
    },
    templateUrl: 'scripts/components/shared/order-dropdown/order-dropdown.html',
    controller: ["$scope", "ConfigService", "CachingService", function($scope, ConfigService, CachingService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.sortName = 'sort by last modified';
        };

        ctrl.orderByQuality = function(concept) {
            return -1 * concept.getScore();
        };
    }]
});
