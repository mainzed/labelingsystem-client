'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LandingCtrl
 * @description
 * # LandingCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LandingCtrl', function ($scope, LabelService) {
    // fetch labels on view init so they can be filtered faster on click
    LabelService.query(function(labels) {
        $scope.labels = labels;
    });

    $scope.onSearchBoxChange = function() {
        if ($scope.labelFilter.length) {
            $scope.showLabels = true;
        } else {
            $scope.showLabels = false;
        }

    };
  });
