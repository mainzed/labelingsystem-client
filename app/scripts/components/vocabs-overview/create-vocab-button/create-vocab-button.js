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
    controller: function ($scope, ngDialog, ConfigService) {

        $scope.languages = ConfigService.languages;

        this.openDialog = function() {

            $scope.newVocab = {
                title: {},
                description: {},
                releaseType: "draft"
            };

            ngDialog.open({
                template: 'scripts/components/vocabs-overview/create-vocab-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };
    }
});
