'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('MainCtrl', function ($scope, $routeParams, $location, AuthService, VocabService, LabelService, FilterService) {

    // redirect if not logged in
    if ($location.path().indexOf("admin/") > -1 && !AuthService.getUser()) {
        $location.path("admin/login");
    }

    $scope.user = AuthService.getUser();

    VocabService.query(function(vocabularies) {
        $scope.vocabularies = vocabularies;
    });

    LabelService.query(function(labels) {
        $scope.labels = labels;
    });

    $scope.vocabFilter = FilterService.getVocabFilter();

    $scope.$watch('vocabFilter', function(newValue) {
        FilterService.setVocabFilter(newValue);
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
                prefLabel: "label1",
                scopeNote: "This is a note"
            },{
                prefLabel: "label2",
                scopeNote: "This is a note"
            },{
                prefLabel: "label3",
                scopeNote: "This is a note"
            },{
                prefLabel: "label4",
                scopeNote: "This is a note"
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

    $scope.onLogoutClick = function() {
        AuthService.logout(function() {
            // success
            $location.path('/admin/login');
        });
    };

  });
