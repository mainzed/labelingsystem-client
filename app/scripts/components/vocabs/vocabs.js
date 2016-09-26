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

    controller: function ($scope, $q, $location, $http, ngDialog, AuthService, VocabService, LabelService, ConfigService) {
        // dont use that, vulnerable
        //$scope.user = AuthService.getUser();

        //$scope.languages = ConfigService.languages;

        $scope.vocabularies = VocabService.query({ creator: "demo" });

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
    }
});
