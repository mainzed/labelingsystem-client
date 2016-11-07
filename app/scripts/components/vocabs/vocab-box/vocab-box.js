'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:vocabBox
 * @description
 * # vocabBox
 */
angular.module('labelsApp')

  .component('lsVocabBox', {
    bindings: {
        data: "=",
        mode: "@"
    },
    templateUrl: "scripts/components/vocabs/vocab-box/vocab-box.html",
    controller: ["$location", "TooltipService", "HelperService", function($location, TooltipService, HelperService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.tooltips = TooltipService;
            HelperService.refreshNanoScroller();
        };

        /**
         * Redirects to the label overview of the specified vocabulary.
         * @param {string} id - Vocabulary ID
         */
        ctrl.onClick = function(id) {
            if (ctrl.mode === "viewer") {
                $location.path('/vocabularies/' + id + '/concepts');
            } else {
                $location.path('/editor/vocabularies/' + id + '/concepts');
            }
        };

        ctrl.openOrcID = function(orcid) {
            HelperService.openLinkInNewTab(orcid);
        }
    }]
});
