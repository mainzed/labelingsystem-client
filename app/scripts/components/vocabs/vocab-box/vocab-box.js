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
    controller: ["$location", "TooltipService", function($location, TooltipService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.tooltips = TooltipService;
            angular.element(".nano").nanoScroller();
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
    }]
});
