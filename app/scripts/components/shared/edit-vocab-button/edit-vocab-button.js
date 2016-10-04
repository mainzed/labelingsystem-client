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
    controller: function ($scope, $rootScope, $location, $document, $anchorScroll, $timeout, ngDialog, VocabService, ConfigService, LabelService, AuthService) {

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
            $scope.newDescription = $scope.vocabulary.description;

            $scope.vocabulary.getEnrichmentVocab(function(vocabID) {
                $scope.checkedVocab = vocabID;
            });

            $scope.user = AuthService.getUser();


            // get number of draft concepts to be published
            // $scope.vocabulary.getDraftConcepts().then(function(concepts) {
            //     $scope.draftConcepts = concepts;
            // });

            // get all vocabs to be able to select them

            $scope.vocabularies = VocabService.queryWithCreator(function() {
                $(".nano").nanoScroller();
                //console.log(vocabs);
                //console.log(vocabs[0]);
            });

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

                // add listener to init nanoScroller once the dialog is loaded
                $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                    if ($scope.dialog.id === $dialog.attr('id')) {  // is the resource dialog
                        $(".nano").nanoScroller();
                    }
                });
            });

            $scope.vocabulary.getEnrichmentVocab(function(vocabID) {
                $scope.enrichmentVocabID = vocabID;
            });
        };

        $scope.onCheck = function() {
            $scope.changedThesauri = true;
        };

        //console.log($scope.vocabulary.getEnrichmentVocab());

        $scope.onVocabCheck = function(id) {
            $scope.checkedVocab = id;
            $scope.vocabChecked = true;
        };

        $scope.deleteVocab = function(id) {
            VocabService.remove({id: id}, function() {
                $location.path("/admin/vocabularies/");
            }, function error(res) {
                console.log(res);
            });
        };

        $scope.publish = function() {

            $scope.processing = true;
            console.log("publishing concepts");

            if ($scope.vocabulary.releaseType === "draft") {
                $scope.vocabulary.releaseType = "public";

                $scope.vocabulary.save(function() {
                    console.log("success");
                }, function error(res) {
                    console.log(res);
                });
            }
        };

        this.update = function(newTitle, newDescription) {

            // check if thesauri have been (de)selected
            // updates automatically
            if ($scope.changedThesauri) {
                $scope.vocabulary.setThesauri($scope.thesauri, function() {
                    //
                    $rootScope.$broadcast("changedThesauri");
                });
            }

            // update vocab list
            if ($scope.vocabChecked) {
                $scope.vocabulary.setEnrichmentVocab($scope.checkedVocab).then(function() {
                    //
                    $rootScope.$broadcast("changedEnrichmentVocab", $scope.checkedVocab.id);

                }, function error(res) {
                    console.log(res);
                });
            }

            $scope.vocabulary.title = newTitle;
            $scope.vocabulary.description = newDescription;

            $scope.vocabulary.save(function() {
                //
            }, function error(res) {
                console.log(res);
            });
        };

        $scope.onDescriptionKeyPress = function(e, description) {
            if (description.length > ConfigService.vocabDescriptionLength - 1) {
                // prevent new characters from being added
                e.preventDefault();
                // shorten description back to allowed length
                $scope.newDescription = description.substring(0, ConfigService.vocabDescriptionLength);
            }
        };

    }
});
