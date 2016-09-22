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
      //
    //   /**
    //    * Deletes a vocabulary permanently using the API's 'delete' option.
    //    * @param {string} id - Vocabulary ID
    //    */
    //   scope.deleteVocab = function (id) {
    //       VocabService.remove({id: id},  function success() {
    //           //element.remove();
    //           console.log("removed vocab successfully");
    //       }, function error(res) {
    //           console.log(res);
    //       });
      //
    //   };
      //
    //   /**
    //    * Replace a vocabulary's thesauri with the currently selected ones.
    //    */
    //   scope.updateVocabThesauri = function() {
    //       var selectedThesauri = _.filter(scope.thesauri, {'checked': true});
    //       ThesauriService.update({id: scope.vocabulary.id}, selectedThesauri, function() {
    //           //
    //       }, function(err) {
    //           console.log(err);
    //       });
    //   };
      //
    //   scope.onCheckChange = function() {
    //       scope.checkedSomething = true;
    //   };
      //
    //   scope.publishVocab = function(vocab) {
    //       if (vocab.releaseType === "draft") {
    //           HelperService.publishVocab(vocab).then(function() {
    //               vocab.releaseType = "public";
    //           });
    //       }
      //
    //   };


  }
});

//
// $scope.newValue = $scope.vocabulary.title.value;
// $scope.newDescription = $scope.vocabulary.description.value;
// $scope.checkedSomething = false;
//
// // get all available thesauri associated with this vocabulary, preload these for search function
// ThesauriService.query(function(thesauri) {
//     $scope.thesauri = thesauri;
//
//     // get this vocabulary's associated thesauri
//     ThesauriService.get({id: $routeParams.vID}, function(vocabThesauri) {
//
//         $scope.vocabThesauri = vocabThesauri;
//         checkVocabThesauri(thesauri, vocabThesauri);
//
//     }, function(error) {
//         console.log(error);
//     });
// }, function(error) {
//     console.log(error);
// });
//
// // init nanscroller
// $(".nano").nanoScroller();
// }
//
// $scope.onCheckChange = function() {
// $scope.checkedSomething = true;
// };
//
// /**
// * Pre-check vocabulary thesauri in list of all available thesauri.
// * @param {Array} thesauri - List of all available thesauri
// * @param {Array} vocabThesauri - List of this vocab's thesauri
// * @returns {Array} List of all available thesauri with additional attribute 'checked'
// */
// function checkVocabThesauri(thesauri, vocabThesauri) {
//
// vocabThesauri.forEach(function(thesaurus) {
//     // special case: add local vocabulary to list of thesauri if missing
//     if (thesaurus.description === "this vocabulary") {
//         // add to available thesauri
//         $scope.thesauri.push(thesaurus);
//     }
//     // pre-select by adding attribute "checked" (gets ignored by API)
//     var checkedThesaurus = _.find($scope.thesauri, { 'name': thesaurus.name });
//     checkedThesaurus.checked = true;
// });
// }
//
// /**
// * Updates the vocabulary's title and description.
// * @param {object} vocab - Vocabulary object
// * @param {string} newValue - New vocabulary title value
// * @param {string} newDescription - New vocabulary description value
// */
// $scope.onEditClick = function(vocab, newValue, newDescription) {
//
// var updatedVocab = vocab;
// updatedVocab.title.value = newValue;
// updatedVocab.description.value = newDescription;
//
// VocabService.update({id: vocab.id}, {
//     user: $scope.user.name,
//     item: updatedVocab
// }, function() {
//     // no need to update display, since dialog gets closed when this
//     // function is called
// }, function(error) {
//     console.log(error);
// });
// };
//
// /**
// * Deletes a vocabulary permanently using the API's 'delete' or 'deprecated'
// * option and redirects to the vocabularies view if successfull. Gets the
// * vocabulary ID from the url using Angular's $routeParams.
// * @param {string} deleteMode="delete" - What request parameter to use ("delete" or "deprecated")
// */
// $scope.deleteVocab = function (deleteMode) {
// deleteMode = deleteMode || "delete";
// if (deleteMode === "delete") {
//     VocabService.remove({id: $routeParams.vID},  function() {
//         $location.path("/admin/vocabularies");
//     }, function(error) {
//         console.log(error);
//     });
// } else if (deleteMode === "deprecated") {
//     VocabService.deprecated({id: $routeParams.vID},  function() {
//         $location.path("/admin/vocabularies");
//     }, function(error) {
//         console.log(error);
//     });
// }
// };
//
// /**
// * Changes a vocabulary's releaseType from "draft" to "public".
// * @param {object} vocab - Vocabulary object
// */
// $scope.onPublicClick = function(vocab) {
// if (vocab.releaseType === "draft") {
//     var updatedVocab = vocab;
//     updatedVocab.releaseType = "public";
//
//     VocabService.update({id: vocab.id}, {
//         user: $scope.user.name,
//         item: updatedVocab
//     }, function() {
//         vocab.releaseType = "public";  // update on success
//     }, function(error) {
//         console.log(error);
//     });
// } else {
//     console.log("vocabulary is not of statusType = 'draft'");
// }
// };
//
// /**
// * Replace a vocabulary's thesauri with the currently selected ones.
// */
// $scope.updateVocabThesauri = function() {
// var selectedThesauri = _.filter($scope.thesauri, {'checked': true});
// ThesauriService.update({id: $routeParams.vID}, selectedThesauri, function() {
//     //
// }, function(err) {
//     console.log(err);
// });
// };
//
// /**
// * Watcher to refresh nanoscroller when thesauri are loaded
// */
// $scope.$watch("thesauri", function() {
// $(".nano").nanoScroller();
// });
