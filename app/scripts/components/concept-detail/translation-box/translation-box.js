
angular.module("labelsApp")
 .component("lsTranslationBox", {
    bindings: {
        data: "=",
        mode: "@"
    },
    templateUrl: "scripts/components/concept-detail/translation-box/translation-box.html",
    controller: ["$scope", "$rootScope", "$routeParams", "ngDialog", "TooltipService", "LabelService", function($scope, $rootScope, $routeParams, ngDialog, TooltipService, LabelService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            ctrl.tooltips = TooltipService;
        };

        /**
         * Opens a dialog with detailed information.
         */
        ctrl.openDialog = function() {
            if (ctrl.mode !== "viewer") {

                ctrl.newValue = ctrl.data.value;
                ctrl.dialog = ngDialog.open({
                    template: "scripts/components/concept-detail/translation-box/dialog.html",
                    className: 'bigdialog',
                    disableAnimation: true,
                    scope: $scope
                });
            }
        };

        /**
         * Deletes the current prefLabel.
         */
        ctrl.onDeleteClick = function() {

            // get current concept
            LabelService.get({id: $routeParams.lID}, function(concept) {

                _.remove(concept.translations, { value: ctrl.data.value, lang: ctrl.data.lang });

                concept.save(function() {
                    ctrl.dialog.close(); // close dialog

                    // delete element by removing it from the displayed concept
                    // but not by deleting the element from the DOM
                    //element.remove(); // delete element from DOM
                    $rootScope.$broadcast("removedTranslation", { translation: ctrl.data });

                }, function error(res) {
                    console.log(res);
                });
            });
        };

        /**
         * Updates the current prefLabel with a newer term.
         * @param {string} newValue - updated term text
         */
        this.updateTranslation = function() {

            // get current concept
            LabelService.get({id: $routeParams.lID}, function(concept) {

                // find and replace
                var index = _.indexOf(concept.translations, _.find(concept.translations, {
                    value: ctrl.data.value,
                    lang: ctrl.data.lang
                }));

                concept.translations.splice(index, 1, {
                    value: ctrl.newValue,
                    lang: ctrl.data.lang
                });

                concept.save(function success() {
                    // temporarily update current element
                    ctrl.data.value = ctrl.newValue;
                    ctrl.dialog.close();

                }, function error(res) {
                    console.log(res);
                });
            });
        };

         // save changes when dialog is closed
        $scope.$on('ngDialog.closed', function (e, $dialog) {
            if (ctrl.dialog && ctrl.dialog.id === $dialog.attr('id')) {  // is the resource dialog
                ctrl.updateTranslation();
            }
        });
    }]
});
