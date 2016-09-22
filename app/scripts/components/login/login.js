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

    controller: function ($scope, $location, $document, AuthService) {
        // skip login if authenticated
        // if (AuthService.isLoggedIn()) {
        //     $location.path("admin/vocabularies");
        // }
        
        //AuthService.status();

        $scope.user = AuthService.getUser();

        $scope.onLoginClick = function() {
            //console.log("login");
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

    }
});
