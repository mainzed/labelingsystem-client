'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LoginCtrl', function ($scope, $location, $document, AuthService) {

    // skip login if authenticated
    if (AuthService.getUser()) {
        $location.path("admin/vocabularies");
    }

    $scope.onLoginClick = function() {
        console.log("login");
        AuthService.login($scope.username, $scope.password, function() {
            // success
            $location.path('/admin/vocabularies');
        }, function(error) {
            // failure
            $scope.error = error;
        });
    };

    // hotkeys
    $document.keydown(function(e) {
        if (e.keyCode === 13) {  // enter
            if ($scope.username && $scope.password) {
                $scope.onLoginClick();
            }
        }
    });

  });
