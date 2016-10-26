'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsCreateConceptButton', {
    bindings: {
        onConfirm: "&"
    },
    template: '<span class="plusposition" ng-click="$ctrl.openDialog()">+</span>',
    controller: function ($scope, $http, $rootScope, $document, $location, $routeParams, ngDialog, ConfigService, VocabService, LicenseService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.showCSV = false;
            ctrl.titleLength = ConfigService.conceptLabelLength;
            ctrl.descriptionLength = ConfigService.conceptDescriptionLength;

            // get vocab to check if it is public
            // TODO: get currentVocab from cache
            VocabService.get({id: $routeParams.vID}, function(vocab) {
                ctrl.vocab = vocab;
            });
        };

        //
        // ctrl.vocabulary
        this.openDialog = function() {

            ctrl.newConcept = {
                thumbnail: "",
                description: ""
            };

            ctrl.dialog = ngDialog.open({
                template: 'scripts/components/concepts/create-concept-button/dialog.html',
                className: 'bigdialog smallheightdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });

            ctrl.import = function() {
                var url = ConfigService.api + "/importcsv/vocabulary/" + $routeParams.vID;

                var fd = new FormData();

                fd.append('fileName', ctrl.filename);

                $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(res) {
                    ctrl.dialog.close();
                    $rootScope.$broadcast("csvUploadComplete");
                })
                .error(function(res) {
                    $scope.errors = res.messages;
                });

            };
        };

        // hotkeys
        $document.keydown(function(e) {
            if (ctrl.dialog && e.keyCode === 13 && !ctrl.conceptForm.$invalid) {  // enter
                ctrl.onConfirm({$newConcept: ctrl.newConcept});
                ctrl.dialog.close();
            }
        });
    }
});
