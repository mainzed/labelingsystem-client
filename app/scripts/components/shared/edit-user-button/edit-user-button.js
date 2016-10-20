'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
     .component('lsEditUserButton', {
        bindings: {
        },
        template: "<span class='icon-user'></span><span class='underlined' ng-click='$ctrl.openDialog()'>{{ $ctrl.user.id }}</span>",

        controller: function ($scope, ngDialog, AuthService) {
            var ctrl = this;

            ctrl.user = AuthService.getUser();

            ctrl.openDialog = function() {

                ngDialog.open({
                    template: 'scripts/components/shared/edit-user-button/dialog.html',
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: $scope
                });

            ctrl.updateUser = function() {
                AuthService.updateUser($scope.user);
            };
        };
    }
 });
