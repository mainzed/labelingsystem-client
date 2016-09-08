'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('prefLabelBox', function (ngDialog) {
    return {
        templateUrl: "views/directives/prefLabel-box.html",
        restrict: 'E',
        scope: {
            data: "="
        },
        link: function postLink(scope) {
            scope.onClick = function() {
                console.log("clicked!");

                ngDialog.open({
                    template: "views/dialogs/small-box-prefLabel.html",
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });


            };
        }
  };
});
