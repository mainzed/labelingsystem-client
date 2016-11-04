
angular.module("labelsApp")
 .component("lsTranslationBox", {
    bindings: {
        data: "=",
        mode: "@"
    },
    templateUrl: "scripts/components/concept-detail/translation-box/translation-box.html",
    controller: ["$scope", "$rootScope", "$routeParams", "ngDialog", "TooltipService", "LabelService", function($scope, $rootScope, $routeParams, ngDialog, TooltipService, LabelService) {
        var ctrl = this;

        this.$onInit = function() {
            ctrl.tooltips = TooltipService;
        }

        /**
         * Opens a dialog with detailed information.
         */
        this.openDialog = function() {
            if (ctrl.mode !== "viewer") {
                ctrl.dialog = ngDialog.open({
                    template: "scripts/components/concept-detail/translation-box/dialog.html",
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: $scope
                });
            }
        };

        /**
         * Deletes the current prefLabel.
         */
        this.onDeleteClick = function() {

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
        this.updateTranslation = function(newValue) {

            // get current concept
            LabelService.get({id: $routeParams.lID}, function(concept) {

                // find and replace
                var index = _.indexOf(concept.translations, _.find(concept.translations, {
                    value: ctrl.data.value,
                    lang: ctrl.data.lang
                }));

                concept.translations.splice(index, 1, {
                    value: newValue,
                    lang: ctrl.data.lang
                });

                concept.save(function success() {
                    // temporarily update current element
                    ctrl.data.value = newValue;
                    ctrl.dialog.close();

                }, function error(res) {
                    console.log(res);
                });
            });
        };
    }]
});
