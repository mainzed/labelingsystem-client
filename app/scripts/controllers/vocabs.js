'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:VocabsCtrl
 * @description
 * # VocabsCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('VocabsCtrl', function ($scope, VocabService) {

    VocabService.query(function(vocabularies) {
        $scope.vocabularies = vocabularies;
    });

  });
