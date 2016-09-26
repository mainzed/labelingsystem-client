'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsVocabs', {
    bindings: {
    },
    templateUrl: "scripts/components/vocabs/vocabs.html",

    controller: function ($scope, $q, $location, $http, ngDialog, AuthService, VocabService) {

        this.$onInit = function () {
            $scope.vocabularies = VocabService.query({ creator: AuthService.getUser().id });
        };

        /**
         * Logout current user and redirect to login page if successfull.
         */
        $scope.onLogoutClick = function() {
            AuthService.logout().then(function () {
                $location.path('/admin/login');
            }, function() {
                console.log("logout failed!!");
            });
        };

        $scope.createVocab = function(vocab) {
            console.log(vocab);
            var jsonObj = {
                item: vocab,
                user: AuthService.getUser().id
            };
            VocabService.save(jsonObj, function(res) {
                $scope.vocabularies.push(res);
            }, function error(res) {
                console.log(res);
            });
        };
    }
});
