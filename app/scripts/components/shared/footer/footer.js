'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:vocabBox
* @description
* # vocabBox
*/
angular.module('labelsApp')

.component('lsFooter', {
    bindings: {
        mode: "@"
    },
    templateUrl: 'scripts/components/shared/footer/footer.html',
    controller: ["$location", "AuthService", "ConfigService", "CachingService", function($location, AuthService, ConfigService, CachingService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.version = ConfigService.version;
            ctrl.user = AuthService.getUser();
        };

        /**
         * Logout current user and redirect to login page if successfull.
         */
        ctrl.onLogoutClick = function() {
            AuthService.logout().then(function () {
                CachingService.reset();
                $location.path('/editor/login');
            }, function error() {
                console.log("logout failed!!");
            });
        };
    }]
});
