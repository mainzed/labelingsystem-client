'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabelsCtrl
 * @description
 * # LabelsCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelsCtrl', function ($scope, $routeParams, $location, AuthService, LabelService, VocabService) {

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
