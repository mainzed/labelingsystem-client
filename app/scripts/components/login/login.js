"use strict";

/**
 * @ngdoc directive
 * @name labelsApp.lsLogin
 * @scope
 * @restrict E
 * @description
 * This is the login component that let's registered users login to the editor.'
 */
 angular.module("labelsApp")
    .component("lsLogin", {
        bindings: {},
        templateUrl: "scripts/components/login/login.html",
        controller: ["$scope", "$location", "$document", "AuthService", function($scope, $location, $document, AuthService) {

            var ctrl = this;

            ctrl.$onInit = function() {
                angular.element("#inputUsername").focus();
            };

            $scope.onLoginClick = function() {
                $scope.error = false;
                $scope.disabled = true;  // block another click

                AuthService.login($scope.username, $scope.password).then(function() {
                    $location.path("/editor/vocabularies");
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
                if ($location.path() === "/editor/login" && e.keyCode === 13 && !$scope.disabled) {  // enter
                    if ($scope.username && $scope.password) {
                        $scope.onLoginClick();
                    }
                }
            });
        }]
    });
