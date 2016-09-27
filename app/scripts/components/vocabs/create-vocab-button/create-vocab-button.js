'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsCreateVocabButton', {
    bindings: {
        onConfirm: "&"
    },
    template: '<span type="button" class="plusposition" ng-click="$ctrl.openDialog()">+</span>',
    controller: function ($scope, ngDialog, ConfigService, LanguageService) {

        $scope.languages = LanguageService.query().then(function(languages) {
            $scope.languages = languages;
        }, function(res) {
            console.log(res);
        });

        $scope.maxLength = ConfigService.vocabDescriptionLength;
        this.openDialog = function() {

            $scope.newVocab = {
                title: "",
                description: "",
                language: "",
                releaseType: "draft"
            };

            ngDialog.open({
                template: 'scripts/components/vocabs/create-vocab-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

        $scope.onDescriptionKeyPress = function(e) {
            //console.log();
            if ($scope.newVocab.description.length > ConfigService.vocabDescriptionLength - 1) {
                // prevent new characters from being added
                e.preventDefault();
                // shorten description back to allowed length
                $scope.newVocab.description = $scope.newVocab.description.substring(0, ConfigService.vocabDescriptionLength);
            }
        };
    }
});
