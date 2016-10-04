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
    controller: function ($scope, $q, $location, $rootScope, $http, ngDialog, AuthService, VocabService) {

        $scope.createVocab = function(vocab) {
            VocabService.save(vocab, function(res) {
                $scope.vocabularies.push(res);
            }, function error(res) {
                console.log(res);
            });
        };

        $rootScope.$watch("isAuthenticated", function(isAuthenticated) {  // set in AuthService when user ready
            if (isAuthenticated) {
                $scope.vocabularies = VocabService.queryWithStats({ creator: AuthService.getUser().id });
            }
        });

    }
});
