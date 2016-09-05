'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:VocabsCtrl
 * @description
 * # VocabsCtrl
 * Controller of the labelsApp. contains functions for pages with vocabulary
 * overviews
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

    $scope.onCreateClick = function() {

        $scope.newVocab = {
            title: {},
            description: {},
            releaseType: "draft"
        };

        ngDialog.open({
            template: 'views/dialogs/create-vocabulary.html',
            showClose: false,
            disableAnimation: true,
            closeByDocument: false,
            scope: $scope
        });

        $scope.onCreateConfirm = function() {
            $scope.newVocab.description.lang = $scope.newVocab.title.lang;

            var jsonObj = {
                item: $scope.newVocab,
                user: $scope.user.name
            };

            VocabService.save(jsonObj, function(res) {
                $scope.vocabularies.push(res);
            }, function(res) {
                console.log(res);
            });
        };
    };

  });
