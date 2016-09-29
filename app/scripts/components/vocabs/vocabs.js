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
        console.log("loading vocabs");


        // $rootScope.$on("userReady", function() {
        //     console.log("caught broadcast! in rootscope");
        //     console.log(AuthService.getUser().id);
        //     $scope.vocabularies = VocabService.query({ creator: AuthService.getUser().id });
        //     //console.log("user ready!");
        //
        // });
        $scope.vocabularies = VocabService.query({ creator: "demo" });

        $rootScope.$on("userReady", function() {
            console.log("caught broadcast in scope!");
            $scope.vocabularies = VocabService.query({ creator: AuthService.getUser().id });
        });

        //$(".nano").nanoScroller();
    }
});
