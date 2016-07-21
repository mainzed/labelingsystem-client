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
