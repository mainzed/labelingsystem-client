'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabelsCtrl
 * @description
 * # LabelsCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelsCtrl', function ($scope, $routeParams, LabelService, VocabService) {
    $scope.placeholder = "loading labels...";

    VocabService.get({id: $routeParams.vID}, function(vocabulary) {
        $scope.vocabulary = vocabulary;
    });

    // load all labels for the current vocabulary

    LabelService.query({'vocab': $routeParams.vID}, function(labels) {
        $scope.labels = labels;
        $scope.placeholder = "filter";
    });

  });
