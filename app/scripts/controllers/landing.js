'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LandingCtrl
 * @description
 * # LandingCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LandingCtrl', function ($scope, $location, LabelService, FilterService) {
    // fetch labels on view init so they can be filtered faster on click
    LabelService.query(function(labels) {
        console.log(labels);
        $scope.labels = labels;
    });

    $scope.labelFilter = FilterService.getSearchFilter();

    $scope.$watch('labelFilter', function(newValue) {
        FilterService.setSearchFilter(newValue);
    });

    $scope.highlightResult = function(labelName, search) {
        return labelName.replace(search, '<span class="highlight">' + search + '</span>');
    };

  });
