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

    $scope.createVocab = function(newVocab) {
        newVocab.description.lang = newVocab.title.lang;

        var jsonObj = {
            item: newVocab,
            user: $scope.user.name
        };

        VocabService.save(jsonObj, function(vocab) {
            //$scope.vocabularies.push(res);
            $location.path("/admin/vocabularies/" + vocab.id);
        }, function(res) {
            console.log(res);
        });
    };
  });
