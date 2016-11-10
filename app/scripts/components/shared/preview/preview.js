'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:lsPreview
* @description
* # vocabBox
*/
angular.module('labelsApp')
  .component('lsPreview', {
    bindings: {
        label: "<",  // uni-directional
        size: "@"  // mini, micro
    },
    templateUrl: 'scripts/components/shared/preview/preview.html',
    controller: function() {
        var ctrl = this;
        
        ctrl.$onInit = function() {
            ctrl.size = ctrl.size || "mini";
        };
    }
});
