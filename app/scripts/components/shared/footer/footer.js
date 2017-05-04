"use strict";

/**
* @ngdoc directive
* @name labelsApp.directive:lsFooter
* @description
* # vocabBox
*/
angular.module("labelsApp")
.component("lsFooter", {
    bindings: {
        mode: "@"
    },
    templateUrl: "scripts/components/shared/footer/footer.html",
    controller: ["$location", "AuthService", "ConfigService", "CachingService", "$cookies", function($location, AuthService, ConfigService, CachingService, $cookies) {
        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.version = ConfigService.version;
            ctrl.user = AuthService.getUser();
            ctrl.userID = $cookies.getObject("lsCookie").userID;
            ctrl.userName = $cookies.getObject("lsCookie").userName;
            ctrl.role = $cookies.getObject("lsCookie").role;
        };

        /**
         * Logout current user and redirect to login page if successfull.
         */
        ctrl.onLogoutClick = function() {
            AuthService.logout().then(function() {
                CachingService.init();
                $location.path("#/");
            }, function error() {
                console.log("logout failed!!");
            });
        };
    }]
});
