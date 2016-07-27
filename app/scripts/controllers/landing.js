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
    $scope.placeholder = "loading labels ...";
    LabelService.query(function(labels) {
        //console.log(labels);
        $scope.labels = labels;
        $scope.placeholder = "search labels";

    });

    $scope.labelFilter = FilterService.getSearchFilter();

    $scope.$watch('labelFilter', function(newValue) {
        FilterService.setSearchFilter(newValue);
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

  });
