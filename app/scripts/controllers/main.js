'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http, $location, AuthService, VocabService, LabelService, FilterService) {

    $scope.vocabFilter = FilterService.getVocabFilter();

    $scope.$watch('vocabFilter', function(newValue) {
        FilterService.setVocabFilter(newValue);
    });
  });
