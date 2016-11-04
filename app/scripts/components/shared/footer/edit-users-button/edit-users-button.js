'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsEditUsersButton', {
    bindings: {},
    template: '<span type="button" class="logout" ng-click="$ctrl.openDialog()">users</span>',
    controller: ["$scope", "ngDialog", "AuthService", "AgentService", function($scope, ngDialog, AuthService, AgentService) {

        var ctrl = this;

        ctrl.$onInit = function() {

        };

        ctrl.openDialog = function() {

            // get users
            ctrl.users = AgentService.query();

            ctrl.dialog = ngDialog.open({
                template: 'scripts/components/shared/footer/edit-users-button/dialog.html',
                className: 'bigdialog',
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.openNewUser = function() {
            ctrl.newUser = {};
            ctrl.showNewUser = true;
        };

        ctrl.create = function() {
            ctrl.newUser.affiliation = "";
            AgentService.save(ctrl.newUser, function(res) {
                ctr.users.push(ctrl.newUser);
            }, function error(res) {
                console.log(res);
            });
        };
    }]
});
