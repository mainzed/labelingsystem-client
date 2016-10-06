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
    controller: function ($scope, $location, TooltipService) {
        var ctrl = this;

        //console.log(ctrl.data.getSomething());
        /**
         * Redirects to the label overview of the specified vocabulary.
         * @param {string} id - Vocabulary ID
         */
        this.onClick = function(id) {
            if (ctrl.mode === "viewer") {
                console.log("open viewer");
                console.log(id);
                $location.path('/vocabularies/' + id + '/concepts');
            } else {
                $location.path('/admin/vocabularies/' + id + '/concepts');
            }
        };

        $scope.tooltips = TooltipService;

        $(".nano").nanoScroller();
    }
});
