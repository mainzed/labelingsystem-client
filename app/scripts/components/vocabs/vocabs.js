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

        $rootScope.$on("userReady", function() {
            $scope.vocabularies = VocabService.query({ creator: AuthService.getUser().id });
            //console.log("user ready!");
        });
    }
});
