'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.lsVocabs
 * @description
 * # lsVocabs
 */
 angular.module('labelsApp')
  .component('lsVocabs', {
    bindings: {
        mode: "@"
    },
    templateUrl: "scripts/components/vocabs/vocabs.html",
    controller: ["$scope", "$location", "$timeout", "$rootScope", "AuthService", "VocabService", "ThesauriService", "CachingService", function($scope, $location, $timeout, $rootScope, AuthService, VocabService, ThesauriService, CachingService) {

        var ctrl = this;
        ctrl.user = null;

        ctrl.$onInit = function () {

            ctrl.loading = true;
            // get filters from cache
            if (CachingService.filters.vocabs) {
                $scope.vocabFilter = CachingService.filters.vocabs;
            }

        };

        ctrl.$onDestroy = function () {
            if (AuthService.isLoggedIn()) {  //prevents caching after logout
                // cache filter value
                CachingService.filters.vocabs = $scope.vocabFilter;

                // cache vocabs
                CachingService[ctrl.mode].vocabs = $scope.vocabularies;
            }
        };

        $rootScope.$watch("isAuthenticated", function(isAuthenticated) {
            if (ctrl.mode === "editor" && isAuthenticated) {
                ctrl.loadEditorVocabs();
            } else if (ctrl.mode === "viewer") {
                ctrl.loadPublicVocabs();
            }
        });

        ctrl.loadEditorVocabs = function() {
            if (CachingService.editor.vocabs) {
                $scope.vocabularies = CachingService.editor.vocabs;
                ctrl.loading = false;
            } else {
                VocabService.query({
                    creator: AuthService.getUser().id,
                    draft: true,
                    statistics: true
                }, function(vocabs) {
                    $scope.vocabularies = vocabs;
                    ctrl.loading = false;
                });
            }
        };

        ctrl.loadPublicVocabs = function() {
            if (CachingService.viewer.vocabs) {
                $scope.vocabularies = CachingService.viewer.vocabs;
                ctrl.loading = false;
            } else {
                VocabService.query({ statistics: true, creatorInfo: true }, function(vocabs) {
                    $scope.vocabularies = vocabs;
                    ctrl.loading = false;
                }, function error(res) {
                    console.log(res);
                });
            }
        };

        $scope.$on("addedVocab", function(event, data) {
            VocabService.save(data.vocab, function(res) {
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
                        $location.path("/editor/vocabularies/" + res.id + "/concepts");

                    }, function error(res) {
                        console.log(res);
                    });
                });

            }, function error(res) {
                console.log(res);
            });
        });

        ctrl.onSearchClick = function() {
            $location.path("/search");
        };

        $scope.$on("removedVocab", function(event, data) {
            _.remove($scope.vocabularies, { id: data.vocabID });
        });

        $scope.$watch("loading", function(loading) {
            if (!loading) {
                $timeout(function() {
                    angular.element('#filtersearch input').focus();
                }, 0);
            }
        });
    }]
});
