'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:vocabBox
* @description
* # vocabBox
*/
angular.module('labelsApp')

.component('lsEditVocabButton', {
    bindings: {
        data: "=",  // concept object
        shortcut: "@"  // "thesauri"
    },
    template: '<span class="{{$ctrl.icon}} icon" ng-click="$ctrl.openDialog()"></span>',
    controller: function ($scope, $location, $document, $anchorScroll, $timeout, ngDialog, VocabService, ConfigService) {

        var ctrl = this;

        // determine icon
        this.icon = "icon-more";
        if (this.shortcut === "thesauri" || this.shortcut === "selectVocab") {
            this.icon = "icon-config";
        }

        this.openDialog = function() {
            // save original vocab object in case the dialog gets cancelled
            $scope.vocabulary = ctrl.data;
            $scope.changedThesauri = false;

            $scope.vocabulary.getThesauri(function(thesauri) {
                $scope.thesauri = thesauri;

                $scope.dialog = ngDialog.open({
                    template: 'scripts/components/shared/edit-vocab-button/dialog.html',
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: $scope
                });
            });

            $scope.vocabulary.getEnrichmentVocab(function(vocabID) {
                $scope.enrichmentVocabID = vocabID;
            });
        };

        $scope.onCheck = function() {
            $scope.changedThesauri = true;
        };

        $scope.deleteVocab = function(id) {
            VocabService.remove({id: id}, function() {
                $location.path("/admin/vocabularies/");
            }, function error(res) {
                console.log(res);
            });
        };

        this.update = function(newTitle, newDescription) {

            // check if thesauri have been (de)selected
            // updates automatically
            if ($scope.changedThesauri) {
                $scope.vocabulary.setThesauri($scope.thesauri, function() {
                    //
                });
            }

            $scope.vocabulary.setTitle(newTitle);
            $scope.vocabulary.setDescription(newDescription);

            $scope.vocabulary.save(function() {
                //
            }, function error(res) {
                console.log(res);
            });
        };

        // hotkey: press "esc" to cancel
        $document.keydown(function(e) {
            if (e.keyCode === 27) {  // esc
                if ($scope.dialog) {
                    $scope.dialog.close();
                }
            }
        });

        // TODO: hotkey: press "enter" to apply

    }
});
