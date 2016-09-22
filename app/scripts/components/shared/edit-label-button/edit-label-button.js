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
        data: "=",
    },
    template: '<span class="icon-edit icon" ng-click="$ctrl.openDialog()"></span>',
    controller: function ($scope, ngDialog, ThesauriService) {
        var ctrl = this;

        this.openDialog = function() {
            $scope.vocabulary = ctrl.data;

            // get all thesauri
            ThesauriService.query(function(thesauri) {
                $scope.thesauri = thesauri;

                // get this vocabulary's associated thesauri
                ThesauriService.get({id: $scope.vocabulary.id}, function(vocabThesauri) {

                    $scope.vocabThesauri = vocabThesauri;

                    // preselect all vocab thesauri
                    angular.forEach($scope.vocabThesauri, function(thesaurus) {
                        //console.log(thesaurus.name);
                        var checkedThesaurus = _.find($scope.thesauri, { 'name': thesaurus.name });
                        if (checkedThesaurus) {  // skips local vocab
                            checkedThesaurus.checked = true;
                        }
                    });

                }, function(error) {
                        console.log(error);
                });

                ngDialog.open({
                    template: 'scripts/components/shared/edit-vocab-button/dialog.html',
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: $scope
                });
            });

        };

    }

});
