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
    controller: function ($scope, VocabService) {
        $scope.vocabularies = VocabService.queryPublic();
    }
});
