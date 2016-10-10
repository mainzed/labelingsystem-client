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
    controller: function ($scope, $timeout, $location, VocabService, LabelService, CachingService) {
        $scope.loading = true;

        if (CachingService.filters.vocabs) {
            $scope.vocabFilter = CachingService.filters.vocabs;
        }

        // get from cache or server
        if (CachingService.viewer.vocabs) {  // already cached
            $scope.vocabularies = CachingService.viewer.vocabs;
            $scope.loading = false;
        } else {
            VocabService.queryPublic(function(vocabs) {
                $scope.vocabularies = vocabs;
                CachingService.viewer.vocabs = vocabs;
                $scope.loading = false;
            }, function error(res) {
                console.log(res);
            });
        }

        // cache all concepts for landing page (if user clicks on search icon)
        if (!CachingService.viewer.allConcepts) {
            LabelService.query(function(concepts) {
                CachingService.viewer.allConcepts = concepts;
            });
        }

        $scope.onSearchClick = function() {
            $location.path("/");
        };

        $scope.$watch("loading", function(loading) {
            if (!loading) {
                $timeout(function() {
                    angular.element('#filtersearch input').focus();
                }, 0);
            }
        });

        /**
         * Save searchvalue in cache.
         */
        $scope.$on("leaveVocabs", function() {
            CachingService.filters.vocabs = $scope.vocabFilter;
        });
    }
});
