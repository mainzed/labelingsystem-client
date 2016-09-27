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
    },
    templateUrl: "scripts/components/vocabs/vocab-box/vocab-box.html",
    controller: function ($location) {
        var ctrl = this;

        //console.log(ctrl.data.getSomething());
        /**
         * Redirects to the label overview of the specified vocabulary.
         * @param {string} id - Vocabulary ID
         */
        this.onClick = function(id) {
            $location.path('/admin/vocabularies/' + id + '/concepts');
        };

        $(".nano").nanoScroller();
    }
});
