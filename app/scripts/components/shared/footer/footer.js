'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:vocabBox
* @description
* # vocabBox
*/
angular.module('labelsApp')

.component('lsFooter', {
    bindings: {},
    templateUrl: 'scripts/components/shared/footer/footer.html',
    controller: function ($scope, $rootScope, $location, ngDialog, AuthService, ConfigService) {
        var ctrl = this;

        ctrl.version = ConfigService.version;
        ctrl.user = AuthService.getUser();

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

        ctrl.onUserClick = function() {
            $scope.user = ctrl.user;
            ngDialog.open({
                template: 'scripts/components/shared/footer/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });

            $scope.updateUser = function() {
                AuthService.updateUser($scope.user);
            };
        };



        // $rootScope.$on("userReady", function() {
        //     console.log("ready");
        //     console.log(AuthService.getUser());
        //     ctrl.user = AuthService.getUser();
        // });
    }
});
