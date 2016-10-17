'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsResultBox', {
    bindings: {
        data: "="
    },
    templateUrl: "scripts/components/landing/result-box/result-box.html",
    controller: function () {
        var ctrl = this;

        ctrl.$onInit = function () {
            
            // init nanoscroller here to prevent default scrollbar while loading boxes
            $(".nano").nanoScroller();

        };

        ctrl.$onDestroy = function () {

        };

    }
});
