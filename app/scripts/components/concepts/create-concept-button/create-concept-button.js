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
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });

            ctrl.import = function(filename) {
                var url = ConfigService.host + "/importcsv/vocabulary/" + $routeParams.vID;

                var fd = new FormData();

                //fd.append('name', "fileName");
                fd.append("file", filename);

                $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(res) {

                    console.log(res);
                    ctrl.dialog.close();
                })
                .error(function(res) {
                    $scope.errors = res.messages;
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
