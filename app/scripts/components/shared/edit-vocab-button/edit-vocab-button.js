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
    controller: function ($scope, $location, $document, $anchorScroll, $timeout, ngDialog) {

        var ctrl = this;

        // determine icon
        this.icon = "icon-more";
        if (this.shortcut === "thesauri" || this.shortcut === "selectVocab") {
            this.icon = "icon-config";
        }

        this.openDialog = function() {
            // save original vocab object in case the dialog gets cancelled
            $scope.vocabulary = ctrl.data;

            $scope.vocabulary.setThesauri(function() {  // sets this.thesauri
                $scope.originalThesauri = $scope.vocabulary.thesauri;

                $scope.dialog = ngDialog.open({
                    template: 'scripts/components/shared/edit-vocab-button/dialog.html',
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: $scope
                });
            });
        };

        this.update = function(newTitle, newDescription) {
            var updatedVocab = $scope.vocabulary;
            updatedVocab.title.value = newTitle;
            updatedVocab.description.value = newDescription;
            $scope.vocabulary.update(function() {
                //console.log("update successfull!");
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
