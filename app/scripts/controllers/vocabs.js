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
  .controller('VocabsCtrl', function ($scope, $q, $location, $http, ngDialog, AuthService, VocabService, LabelService, ConfigService) {

    if (!AuthService.isLoggedIn()) {
        $location.path("admin/login");
    }

    // dont use that, vulnerable
    $scope.user = AuthService.getUser();

    $scope.languages = ConfigService.languages;

    VocabService.query({ creator: $scope.user.username }, function(vocabularies) {
        $scope.vocabularies = vocabularies;
    });

    /**
     * Logout current user and redirect to login page if successfull.
     */
    $scope.onLogoutClick = function() {
        AuthService.logout(function() {
            $location.path('/admin/login');
        }, function(err) {
            console.log(err);
        });
    };

    $scope.openUserDialog = function() {
        ngDialog.open({
            template: 'views/dialogs/user-metadata.html',
            className: 'bigdialog',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            scope: $scope
        });
    };

    $scope.onUsersClick = function() {
        console.log("create user");
    };

    // $scope.onSelectionChange = function(name) {
    //     // get thesaurus by name
    //     var thesaurus;
    //     for (var i = 0; i < $scope.thesauri.length; i++) {
    //         if ($scope.thesauri[i].name === name) {
    //             thesaurus = $scope.thesauri[i];
    //             break;
    //         }
    //     }
    //     $scope.vocabThesauri.push(thesaurus);
    // };

    $scope.onCreateClick = function() {

        $scope.newVocab = {
            title: {},
            description: {},
            releaseType: "draft"
        };

        ngDialog.open({
            template: 'views/dialogs/create-vocabulary.html',
            className: 'bigdialog',
            closeByDocument: false,
            showClose: false,
            disableAnimation: true,
            scope: $scope
        });

        $scope.onCreateConfirm = function() {
            $scope.newVocab.description.lang = $scope.newVocab.title.lang;

            var jsonObj = {
                item: $scope.newVocab,
                user: $scope.user.name
            };

            VocabService.save(jsonObj, function(vocab) {
                //$scope.vocabularies.push(res);
                $location.path("/admin/vocabularies/" + vocab.id);
            }, function(res) {
                console.log(res);
            });
        };
    };

  });
