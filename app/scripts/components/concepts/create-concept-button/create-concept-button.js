'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsCreateConceptButton', {
    bindings: {
        onConfirm: "&"
    },
    template: '<span class="plusposition" ng-click="$ctrl.openDialog()">+</span>',
    controller: function ($scope, $http, $document, $routeParams, ngDialog, ConfigService) {
        var ctrl = this;

        ctrl.showCSV = false;

        this.openDialog = function() {

            ctrl.newConcept = {
                thumbnail: "",
                description: ""
            };

            ctrl.dialog = ngDialog.open({
                template: 'scripts/components/concepts/create-concept-button/dialog.html',
                className: 'bigdialog smallheightdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });

            ctrl.import = function(filename) {
                //var url = ConfigService.host + "/importcsv/vocabulary/" + $routeParams.vID;


                var fd = new FormData();
                fd.append('file', filename);
                $.ajax({
                    url: ConfigService.host + "/importcsv/vocabulary/" + $routeParams.vID,
                    data: fd,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(data) {
                        console.log(data);
                        //ctrl.dialog.close();
                    }
                });

            };
        };



        $scope.titleLength = ConfigService.conceptLabelLength;
        $scope.descriptionLength = ConfigService.conceptDescriptionLength;

        // hotkeys
        $document.keydown(function(e) {
            if (ctrl.dialog && e.keyCode === 13 && !ctrl.conceptForm.$invalid) {  // enter
                ctrl.onConfirm({$newConcept: ctrl.newConcept});
                ctrl.dialog.close();
            }
        });
    }
});
