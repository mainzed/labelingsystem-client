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
    controller: ["$scope", "$rootScope", "ngDialog", "VocabService", "AuthService", "HelperService", function($scope, $rootScope, ngDialog, VocabService, AuthService, HelperService) {

        var ctrl = this;

        ctrl.thesauri = null;
        ctrl.dialog = null;
        ctrl.referenceVocabID = null;

        ctrl.$onInit = function() {
            ctrl.mode = ctrl.mode || "thesauri";
            ctrl.heading = ctrl.mode === "thesauri" ? "Reference thesauri" : "Reference vocabulary";
            ctrl.user = AuthService.getUser();
            HelperService.refreshNanoScroller();
        };

        this.openDialog = function() {
            if (ctrl.mode === "thesauri") {
                // get thesauri
                ctrl.data.getThesauri(function(thesauri) {
                    ctrl.thesauri = thesauri;
                    HelperService.refreshNanoScroller();
                });
            } else {
                // get current reference vocab
                ctrl.data.getEnrichmentVocab(function(vocabID) {
                    ctrl.referenceVocabID = vocabID;
                });

                // get all available public vocabs
                VocabService.query({ creatorInfo: true, draft: true }, function(vocabs) {

                    ctrl.vocabs = _.filter(vocabs, function(o) {
                        return ctrl.data.title === o.title || o.releaseType === "public";
                    });

                    //CachingService.editor.vocabsWithCreator = vocabs;
                    HelperService.refreshNanoScroller();
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
        };

    }]
});
