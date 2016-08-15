'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:VocabsCtrl
 * @description
 * # VocabsCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('VocabsCtrl', function ($scope, $location, $http, ngDialog, AuthService, VocabService) {

    // authentication
    if ($location.path().indexOf("admin/") > -1) {  // is admin view
        if (!AuthService.getUser()) {
            // redirect if not logged in
            $location.path("admin/login");
        } else {
            // if logged in, get user name
            $scope.user = AuthService.getUser();
        }
    }

    VocabService.query(function(vocabularies) {
        $scope.vocabularies = vocabularies;
    });

    $scope.onLogoutClick = function() {
        AuthService.logout(function() {
            // success
            $location.path('/admin/login');
        });
    };

    $scope.onEditClick = function(id) {
        // get vocabulary
        for (var i = 0; i < $scope.vocabularies.length; i++) {
            var vocab = $scope.vocabularies[i];
            if (vocab.id === id) {
                $scope.vocab = vocab;
                break;
            }
        }

        // get thesauri for vocabulary
        // TODO: change that to query onl yvocab retcat
        $http.get('http://143.93.114.135/api/v1/retcat').then(function(res) {
            // success
            $scope.vocabThesauri = res.data.slice(0,3);
        }, function() {
            // error
        });

        // get all available thesauri to add
        $http.get('http://143.93.114.135/api/v1/retcat').then(function(res) {
            // success
            $scope.thesauri = res.data;
        }, function() {
            // error
        });

        ngDialog.open({
            template: 'views/dialogs/vocabulary-edit.html',
            scope: $scope
        });
    };

    $scope.onSelectionChange = function(name) {
        // get thesaurus by name
        var thesaurus;
        for (var i = 0; i < $scope.thesauri.length; i++) {
            if ($scope.thesauri[i].name === name) {
                thesaurus = $scope.thesauri[i];
                break;
            }
        }
        $scope.vocabThesauri.push(thesaurus);
    };

  });
