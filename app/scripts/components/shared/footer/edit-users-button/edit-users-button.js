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
    template: '<span type="button" class="logout" ng-click="$ctrl.openDialog()">manage users</span>',
    controller: ["$scope", "ngDialog", "AuthService", "AgentService", function($scope, ngDialog, AuthService, AgentService) {

        var ctrl = this;

        ctrl.$onInit = function() {};

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

        /** 
         * @param {Object} user - LS Agent object
         */
        ctrl.showUserEdit = function(user) {
            ctrl.editUser = true;
            ctrl.user = user;
        };

        ctrl.create = function() {
            delete ctrl.newUser.passwordConfirm;
            AgentService.save(ctrl.newUser, function(res) {
                ctrl.users.push(ctrl.newUser);
                ctrl.showNewUser = false;
            }, function error(res) {
                ctrl.error = true;
                console.log(res);
            });
        };

        ctrl.save = function(user) {

            AgentService.update({ id: user.id }, user, function() {
                
                // remove old object
                _.remove(ctrl.users, { id: user.id });

                // add updated user object
                ctrl.users.push(ctrl.user);

                ctrl.editUser = false;
            }, function error(res) {
                ctrl.error = true;
                console.log(res);
            });
        };

        ctrl.isValidNew = function(user) {
            return user.id && user.firstName && user.lastName && user.orcid && user.affiliation && user.pwd && (user.pwd === user.passwordConfirm) && _.startsWith(user.affiliation, "http") && _.startsWith(user.orcid, "http") && !_.find(ctrl.users, {id: user.id});
        };

        ctrl.isValidUpdate = function(user) {
            return user.firstName && user.lastName && user.orcid && user.affiliation && user.status && _.startsWith(user.affiliation, "http") && _.startsWith(user.orcid, "http");
        };
    }]
});
