'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabelsCtrl
 * @description
 * # LabelsCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelsCtrl', function ($scope, $routeParams, $location, AuthService, LabelService, VocabService, TooltipService) {

    // authentication
    if ($location.path().indexOf("admin/") > -1) {  // is admin view
        if (!AuthService.getUser()) {
            // redirect if not logged in
            $location.path("admin/login");
        } else {
            // if logged in, get user name
            $scope.user = AuthService.getUser();
        }
    }

    $scope.tooltips = TooltipService;

    $scope.placeholder = "loading labels...";

    VocabService.get({id: $routeParams.vID}, function(vocabulary) {
        $scope.vocabulary = vocabulary;
    });

    // load all labels for the current vocabulary
    LabelService.query({'vocab': $routeParams.vID}, function(labels) {
        $scope.labels = labels;
        //console.log(labels[0]);
        $scope.placeholder = "filter";
    });

    $scope.onLabelClick = function(id) {
        $location.path("admin/vocabularies/" + $scope.vocabulary.id + "/labels/" + id);
    };



  });
