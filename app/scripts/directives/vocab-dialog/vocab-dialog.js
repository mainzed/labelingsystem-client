'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:vocabDialog
 * @description
 * # vocabDialog
 */
angular.module('labelsApp')
  .directive('lsVocabDialog', function (ngDialog, VocabService, ThesauriService, HelperService) {
    return {
      //template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the vocabDialog directive');
        //console.log("directive works!, opendialog on click");

        //console.log(scope.data);
        scope.vocabulary = scope.data;

        // open dialog when element is clicked
        element.on('click', function () {
            scope.openVocabDialog(scope.vocabulary.id);
        });

        /**
         * Opens the metadata/settings dialog of a vocabulary.
         */
        scope.openVocabDialog = function(id) {
            VocabService.get({id: id}, function(vocab) {
                scope.vocabulary = vocab;

                // get all thesauri
                ThesauriService.query(function(thesauri) {
                    scope.thesauri = thesauri;

                    // get this vocabulary's associated thesauri
                    ThesauriService.get({id: id}, function(vocabThesauri) {

                        scope.vocabThesauri = vocabThesauri;

                        // preselect all vocab thesauri
                        angular.forEach(scope.vocabThesauri, function(thesaurus) {
                            //console.log(thesaurus.name);
                            var checkedThesaurus = _.find(scope.thesauri, { 'name': thesaurus.name });
                            if (checkedThesaurus) {  // skips local vocab
                                checkedThesaurus.checked = true;
                            }
                        });

                    }, function(error) {
                        console.log(error);
                    });
                }, function(error) {
                    console.log(error);
                });

                ngDialog.open({
                    template: 'scripts/directives/vocab-dialog/vocab-dialog.html',
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });
            });
        };

        //scope.getVoca

        /**
         * Deletes a vocabulary permanently using the API's 'delete' option.
         * @param {string} id - Vocabulary ID
         */
        scope.deleteVocab = function (id) {
            VocabService.remove({id: id},  function success() {
                //element.remove();
                console.log("removed vocab successfully");
            }, function error(res) {
                console.log(res);
            });

        };

        /**
         * Replace a vocabulary's thesauri with the currently selected ones.
         */
        scope.updateVocabThesauri = function() {
            var selectedThesauri = _.filter(scope.thesauri, {'checked': true});
            ThesauriService.update({id: scope.vocabulary.id}, selectedThesauri, function() {
                //
            }, function(err) {
                console.log(err);
            });
        };

        scope.onCheckChange = function() {
            scope.checkedSomething = true;
        };

        scope.publishVocab = function(vocab) {
            if (vocab.releaseType === "draft") {
                HelperService.publishVocab(vocab).then(function() {
                    vocab.releaseType = "public";
                });
            }

        };
      }
    };
  });
