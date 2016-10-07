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
    controller: function ($scope, $timeout, $location, VocabService) {
        $scope.vocabularies = VocabService.queryPublic();

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
    }
});
