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
    controller: function ($scope, $q, $location, $timeout, $rootScope, $http, ngDialog, AuthService, VocabService, ThesauriService) {
        $scope.loading = true;

        $scope.createVocab = function(vocab) {
            VocabService.save(vocab, function(res) {
                $scope.vocabularies.push(res);

                // update the thesauri for the new vocab and add the default ones
                var vocabThesauri = [];
                ThesauriService.query(function(thesauri) {
                    thesauri.forEach(function(thesaurus) {
                        if (thesaurus.default) {
                            vocabThesauri.push(thesaurus);
                        }
                    });

                    // update
                    ThesauriService.update({id: res.id}, vocabThesauri, function() {
                        // redirect when everything finished
                        $location.path("/admin/vocabularies/" + res.id + "/concepts");

                    }, function error(res) {
                        console.log(res);
                    });

                });

            }, function error(res) {
                console.log(res);
            });
        };

        $rootScope.$watch("isAuthenticated", function(isAuthenticated) {  // set in AuthService when user ready
            if (isAuthenticated) {
                $scope.vocabularies = VocabService.queryWithStats({ creator: AuthService.getUser().id });
                $scope.loading = false;
            }
        });

        $scope.$watch("loading", function(loading) {
            if (!loading) {
                $timeout(function() {
                    angular.element('#filtersearch input').focus();
                }, 0);
            }
        });

    }
});
