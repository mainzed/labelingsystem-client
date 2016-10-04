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

        $rootScope.$watch("authenticated", function() {  // set in AuthService when user ready
            $scope.vocabularies = VocabService.query({ creator: AuthService.getUser().id });
        });

    }
});
