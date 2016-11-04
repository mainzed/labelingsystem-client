"use strict";

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsExtendButton', {
    bindings: {
        onClick: "@"
    },
    template: '<span class="extendbutton" ng-click="$ctrl.toggle()">{{ $ctrl.text }}<span class="{{$ctrl.icon}}"></span></span>',

    controller: ["CachingService", function(CachingService) {

        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.text = CachingService.toggles.extendAll ? "collapse boxes" : "extend boxes";
            ctrl.icon = CachingService.toggles.extendAll ? "icon-minimize" : "icon-expand";

        };

        ctrl.toggle = function() {
            CachingService.toggles.extendAll = !CachingService.toggles.extendAll;
            ctrl.text = CachingService.toggles.extendAll ? "collapse boxes" : "extend boxes";
            ctrl.icon = CachingService.toggles.extendAll ? "icon-minimize" : "icon-expand";
        }
    }]
});
