'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsLogin', {
    bindings: {
    },
    templateUrl: "scripts/components/login/login.html",

    controller: function ($scope, $rootScope, $location, $document, AuthService) {

        $scope.onLoginClick = function() {
            $scope.error = false;
            $scope.disabled = true;  // block another click

            AuthService.login($scope.username, $scope.password).then(function() {
                $location.path('/editor/vocabularies');
            })
            .catch(function() {
                $scope.error = true;
                $scope.errorMessage = "some error message";  // res.userMessage
                $scope.disabled = false;
                $scope.username = "";
                $scope.password = "";
            });
        };

        // hotkeys
        $document.keydown(function(e) {
            if ($location.path() === "/editor/login" && e.keyCode === 13) {  // enter
                if ($scope.username && $scope.password) {
                    $scope.onLoginClick();
                }
            }
        });
    }
});
