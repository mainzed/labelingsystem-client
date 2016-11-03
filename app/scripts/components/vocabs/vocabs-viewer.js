'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsVocabsViewer', {
    bindings: {
    },
    templateUrl: "scripts/components/vocabs/vocabs-viewer.html",
    controller: ["$scope", "$timeout", "$location", "VocabService", "LabelService", "CachingService", function($scope, $timeout, $location, VocabService, LabelService, CachingService) {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.loading = true;

            if (CachingService.filters.vocabs) {
                $scope.vocabFilter = CachingService.filters.vocabs;
            }

            // get from cache or server
            if (CachingService.viewer.vocabs) {  // already cached
                $scope.vocabularies = CachingService.viewer.vocabs;
                ctrl.loading = false;
            } else {
                ctrl.loadVocabs();
            }

            // cache all concepts for landing page (if user clicks on search icon)
            if (!CachingService.viewer.allConcepts) {
                LabelService.query(function(concepts) {
                    CachingService.viewer.allConcepts = concepts;
                });
            }
        };

        ctrl.$onDestroy = function () {
            // cache filter value
            CachingService.filters.vocabs = $scope.vocabFilter;

            // cache vocabs
            CachingService.viewer.vocabs = $scope.vocabularies;
        };

        ctrl.loadVocabs = function() {
            VocabService.query({ statistics: true, creatorInfo: true }, function(vocabs) {
                $scope.vocabularies = vocabs;
                ctrl.loading = false;
            }, function error(res) {
                console.log(res);
            });
        }

        $scope.onSearchClick = function() {
            $location.path("/search");
        };

        $scope.$watch("ctrl.loading", function(loading) {
            if (!loading) {
                $timeout(function() {
                    angular.element('#filtersearch input').focus();
                }, 0);
            }
        });
    }]
});
