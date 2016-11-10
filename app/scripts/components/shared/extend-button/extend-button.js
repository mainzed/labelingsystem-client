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
    template: '<span class="extendbutton" ng-click="$ctrl.toggle()">{{ $ctrl.text }}<span class="{{ $ctrl.icon }}"></span></span>',

    controller: ["CachingService", function(CachingService) {

        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.isCollapsed = true;
            ctrl.text = "extend boxes";
            ctrl.icon = "icon-expand";
        };

        ctrl.toggle = function() {
            ctrl.isCollapsed = !ctrl.isCollapsed;
            ctrl.text = ctrl.isCollapsed ? "extend boxes" : "collapse boxes";
            ctrl.icon = ctrl.isCollapsed ? "icon-expand" : "icon-minimize";
        }
    }]
});
