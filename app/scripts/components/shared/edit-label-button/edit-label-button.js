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
    controller: function ($scope, $location, $routeParams, ngDialog, ConfigService, LabelService, VocabService) {
        var ctrl = this;

        $scope.publicLabelEdit = ConfigService.publicLabelEdit;
        
        /**
         * Opens the metadata/settings dialog of a vocabulary.
         */
        this.openDialog = function() {
            $scope.label = ctrl.data;

            // get vocab to check if public and determine if this concept can be deleted
            VocabService.get({id: $routeParams.vID}, function(vocab) {
                $scope.vocab = vocab;
            });

            $scope.newLabel = $scope.label.thumbnail;
            ngDialog.open({
                template: 'scripts/components/shared/edit-label-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
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
        $scope.deleteConcept = function(concept) {
            LabelService.remove({id: concept.id}, function() {
                $location.path("/admin/vocabularies/" + $routeParams.vID + "/concepts");
            }, function(res) {
                console.log(res);
            });
        };

        this.onApply = function(value) {
            $scope.label.setLabel(value);
            $scope.label.save(function() {
                //console.log("success");
            }, function error(res) {
                console.log(res);
            });
        };
    }

});
