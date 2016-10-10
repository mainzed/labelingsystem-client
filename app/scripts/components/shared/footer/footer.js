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
    controller: function ($scope, $rootScope, $location, ngDialog, AuthService, ConfigService) {
        var ctrl = this;

        ctrl.version = ConfigService.version;

        /**
         * Logout current user and redirect to login page if successfull.
         */
        ctrl.onLogoutClick = function() {
            AuthService.logout().then(function () {
                $location.path('/admin/login');
            }, function() {
                console.log("logout failed!!");
            });
        };





        // $rootScope.$on("userReady", function() {
        //     console.log("ready");
        //     console.log(AuthService.getUser());
        //     ctrl.user = AuthService.getUser();
        // });
    }
});
