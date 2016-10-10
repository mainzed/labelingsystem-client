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
    controller: function ($scope, $q, $location, $timeout, $rootScope, $http, ngDialog, AuthService, VocabService, ThesauriService, CachingService) {
        $scope.loading = true;

        if (CachingService.filters.vocabs) {
            $scope.vocabFilter = CachingService.filters.vocabs;
        }

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

                // get from cache or server
                if (CachingService.editor.vocabs) {
                    $scope.vocabularies = CachingService.editor.vocabs;
                    $scope.loading = false;
                } else {
                    VocabService.queryWithStats({ creator: AuthService.getUser().id }, function(vocabs) {
                        $scope.vocabularies = vocabs;
                        CachingService.editor.vocabs = vocabs;
                        $scope.loading = false;
                    });
                }
            }
        });

        /**
         * Save searchvalue in cache.
         */
        $scope.$on("leaveVocabs", function() {
            CachingService.filters.vocabs = $scope.vocabFilter;
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
