"use strict";

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('checkbox', {
    bindings: {
        ngModel: '=',  // thesaurus
        onCheck: '&'  // references parent-scope function
    },
    templateUrl: "scripts/components/shared/checkbox/checkbox.html",

    controller: function () {

        var ctrl = this;

        ctrl.$onInit = function() {};

        ctrl.check = function() {
            ctrl.ngModel.checked = !ctrl.ngModel.checked;
            ctrl.onCheck();
        }

    }
});
