'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:VocabsCtrl
 * @description
 * # VocabsCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('VocabsCtrl', function ($scope, $location, AuthService, VocabService) {

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

    VocabService.query(function(vocabularies) {
        $scope.vocabularies = vocabularies;
    });

    $scope.onLogoutClick = function() {
        AuthService.logout(function() {
            // success
            $location.path('/admin/login');
        });
    };

  });
