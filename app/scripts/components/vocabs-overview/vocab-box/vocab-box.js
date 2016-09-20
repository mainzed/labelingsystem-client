'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:vocabBox
 * @description
 * # vocabBox
 */
angular.module('labelsApp')
  .directive('lsVocabBox', function ($location, ngDialog, VocabService, ThesauriService, HelperService) {
    return {
        templateUrl: 'scripts/components/vocabs-overview/vocab-box/vocab-box.html',
        restrict: 'E',
        scope: {
            data: "="
        },
        link: function postLink(scope, element) {

            /**
             * Redirects to the label overview of the specified vocabulary.
             * @param {string} id - Vocabulary ID
             */
            scope.onClick = function(id) {
                $location.path('/admin/vocabularies/' + id + '/concepts');
            };

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
                        template: 'scripts/components/vocabs-overview/vocab-box/dialog.html',
                        className: 'bigdialog',
                        showClose: false,
                        closeByDocument: false,
                        disableAnimation: true,
                        scope: scope
                    });
                });
            };

            /**
             * Deletes a vocabulary permanently using the API's 'delete' option.
             * @param {string} id - Vocabulary ID
             */
            scope.deleteVocab = function (id) {
                VocabService.remove({id: id},  function success() {
                    element.remove();
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

            /**
             * Get skos of vocabulary url
             * @param {string} id - Vocabulary ID
             * @return {string} url to download vocab in skos format
             */
            // $scope.getDownloadUrl = function(id) {
            //     return ConfigService.host + "/vocabs/" + id + ".skos";
            // };

        }
    };
});
