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

        /**
         * Order function for the use with the ng-repeat directive. Grades a label
         * by how many connections it has to internal or external resources.
         * @param {object} concept
         * @returns {number}
         */
        ctrl.orderByQuality = function(concept) {
            return -1 * concept.getScore();
        };
    }]
});
