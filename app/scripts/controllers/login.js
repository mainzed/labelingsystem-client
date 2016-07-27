'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LoginCtrl', function ($scope, $location, AuthService) {

    // skip login if authenticated
    if (AuthService.getUser()) {
        $location.path("admin/vocabularies");
    }
    
    $scope.onLoginClick = function() {
        AuthService.login($scope.username, $scope.password, function() {
            // success
            $location.path('/admin/vocabularies');
        }, function(error) {
            // failure
            $scope.error = error;
        });
    };

  });
