'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsVocabs', {
    bindings: {},
    templateUrl: "scripts/components/vocabs/vocabs.html",
    controller: function ($scope, $q, $location, $timeout, $rootScope, $http, ngDialog, AuthService, VocabService, ThesauriService, CachingService) {

        var ctrl = this;

        ctrl.$onInit = function () {
            $scope.loading = true;

            // get filters from cache
            if (CachingService.filters.vocabs) {
                $scope.vocabFilter = CachingService.filters.vocabs;
            }
        };

        ctrl.$onDestroy = function () {
            //console.log("destroy ")
            // cache filter value
            CachingService.filters.vocabs = $scope.vocabFilter;

            // cache vocabs
            CachingService.viewer.vocabs = $scope.vocabularies;
        };

        ctrl.loadVocabs = function() {
            VocabService.queryWithStats({ creator: AuthService.getUser().id }, function(vocabs) {
                $scope.vocabularies = vocabs;
                CachingService.editor.vocabs = vocabs;
                $scope.loading = false;
            });
        };

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
                        $location.path("/editor/vocabularies/" + res.id + "/concepts");

                    }, function error(res) {
                        console.log(res);
                    });
                });

            }, function error(res) {
                console.log(res);
            });
        };

        $rootScope.$on("removedVocab", function(event, data) {
            _.remove($scope.vocabularies, { id: data.vocabID});
        });

        $rootScope.$watch("isAuthenticated", function(isAuthenticated) {  // set in AuthService when user ready

            if (isAuthenticated) {

                // get from cache or server
                if (CachingService.editor.vocabs) {
                    $scope.vocabularies = CachingService.editor.vocabs;
                    $scope.loading = false;
                } else {
                    ctrl.loadVocabs();
                }
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
