'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('MainCtrl', function ($scope, $routeParams, $location, AuthService, VocabService, LabelService) {

    $scope.user = AuthService.getUser();

    VocabService.query(function(vocabularies) {
        $scope.vocabularies = vocabularies;
    });

    LabelService.query(function(labels) {
        $scope.labels = labels;
    });

    $scope.getVocabulary = function() {
        VocabService.get($routeParams.vID, function(vocabulary) {
            $scope.vocabulary = vocabulary.vocab;
        });
    };

    $scope.getLabel = function() {

        VocabService.get($routeParams.vID, function(vocabulary) {
            $scope.vocabulary = vocabulary.vocab;
        });

        LabelService.get($routeParams.lID, function(label) {
            $scope.label = label.label;
        });
    };

    $scope.searchInRepositories = function() {
        $scope.searchResults = [
            {
                prefLabel: "label1"
            },{
                prefLabel: "label2"
            },{
                prefLabel: "label3"
            },{
                prefLabel: "label4"
            }
        ];
    };

    $scope.onNarrowerClick = function(prefLabel) {
        if ($scope.label.narrowMatch.indexOf(prefLabel) === -1) {
            $scope.label.narrowMatch.push(prefLabel);
        }
    };

    $scope.onBroaderClick = function(prefLabel) {
        if ($scope.label.broadMatch.indexOf(prefLabel) === -1) {
            $scope.label.broadMatch.push(prefLabel);
        }
    };

  });
