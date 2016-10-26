'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:vocabBox
* @description
* # vocabBox
*/
angular.module('labelsApp')

.component('lsSearchSettingsButton', {
    bindings: {
        data: "=data",  // vocab
        mode: "@"  // "thesauri" or "vocabs"
    },
    template: '<span class="icon-config icon" ng-click="$ctrl.openDialog()"></span>',
    controller: function ($scope, $rootScope, $timeout, ngDialog, VocabService, AuthService) {

        var ctrl = this;

        ctrl.thesauri = null;
        ctrl.dialog = null;
        ctrl.referenceVocabID = null;

        function refreshNanoScroller() {
            $timeout(function () {
                angular.element(".nano").nanoScroller();
            }, 0);
        }

        ctrl.$onInit = function() {
            ctrl.mode = ctrl.mode || "thesauri";
            ctrl.heading = ctrl.mode === "thesauri" ? "Reference thesauri" : "Reference vocabulary";
            ctrl.user = AuthService.getUser();
            refreshNanoScroller();
        };

        this.openDialog = function() {
            if (ctrl.mode === "thesauri") {
                // get thesauri
                ctrl.data.getThesauri(function(thesauri) {
                    ctrl.thesauri = thesauri;
                    refreshNanoScroller();
                });
            } else {
                // get current reference vocab
                ctrl.data.getEnrichmentVocab(function(vocabID) {
                    ctrl.referenceVocabID = vocabID;
                });

                // get all available public vocabs
                VocabService.query({creatorInfo: true}, function(vocabs) {

                    ctrl.vocabs = _.filter(vocabs, function(o) {
                        return o.creator === ctrl.user.id || o.releaseType === "public";
                    });

                    //CachingService.editor.vocabsWithCreator = vocabs;
                    refreshNanoScroller();
                });
            }

            ctrl.dialog = ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/search-settings-button/dialog.html',
                className: 'bigdialog',
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.saveThesauri = function() {
            ctrl.data.setThesauri(ctrl.thesauri, function() {
                $rootScope.$broadcast("changedThesauri");
            });
        };

        ctrl.saveReferenceVocab = function(vocabID) {
            // update vocab list
            ctrl.data.setEnrichmentVocab(vocabID).then(function() {
                ctrl.referenceVocabID = vocabID;
                $rootScope.$broadcast("changedEnrichmentVocab", vocabID);
            }, function error(res) {
                console.log(res);
            });
        }

        ctrl.isValidVocab = function(vocab) {
            return ctrl.data.title === vocab.title || vocab.releaseType === "public";
        }

        ctrl.getCreatorAsLink = function(vocab) {
            if (vocab.creatorInfo) {
                var fullName = [
                    //vocab.creatorInfo.title,
                    vocab.creatorInfo.firstName,
                    vocab.creatorInfo.lastName
                ].join(" ");
                return "<a href=" + vocab.creatorInfo.orcid + " target='_blank'>" + fullName + "</a>";
            }

        }
    }
});
