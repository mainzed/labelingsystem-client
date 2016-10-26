'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:vocabBox
* @description
* # vocabBox
*/
angular.module('labelsApp')

.component('lsEditLabelButton', {
    bindings: {
        data: "=",
    },
    template: '<span class="icon-more icon" ng-click="$ctrl.openDialog()"></span>',
    controller: function ($scope, $rootScope, $location, $routeParams, ngDialog, ConfigService, LabelService, VocabService, HelperService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.publicLabelEdit = ConfigService.publicLabelEdit;
        }

        /**
         * Opens the metadata/settings dialog of a vocabulary.
         */
        this.openDialog = function() {
            ctrl.modifiedLabel = false;

            // get vocab to check if public and determine if this concept can be deleted
            VocabService.get({id: $routeParams.vID}, function(vocab) {
                $scope.vocab = vocab;
            });

            ctrl.dialog = ngDialog.open({
                template: 'scripts/components/shared/edit-label-button/dialog.html',
                className: 'bigdialog',
                disableAnimation: true,
                scope: $scope
            });

            // add listener to init nanoScroller once the dialog is loaded
            $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                if (ctrl.dialog.id === $dialog.attr('id')) {  // is the resource dialog
                    HelperService.refreshNanoScroller();
                }
            });
        };

        /**
         * Get skos of label url
         * @param {string} id - label ID
         * @return {string} url to download vocab in skos format
         */
        $scope.getDownloadUrl = function(id) {
            return ConfigService.api + "/labels/" + id;
        };

        /**
         * Deletes a concept.
         */
        ctrl.deleteConcept = function() {
            LabelService.remove({id: ctrl.data.id}, function() {
                ctrl.dialog.close();
                $rootScope.$broadcast("removedConcept", { id: ctrl.data.id});
                $location.path("/editor/vocabularies/" + $routeParams.vID + "/concepts");
            }, function(res) {
                console.log(res);
            });
        };

        $rootScope.$on('ngDialog.closed', function (e, $dialog) {
            if (ctrl.dialog && ctrl.dialog.id === $dialog.attr('id') && ctrl.modifiedLabel) {
                ctrl.data.save(function success() {
                    //console.log("success");
                }, function error(res) {
                    console.log(res);
                });
            }
        });
    }

});
