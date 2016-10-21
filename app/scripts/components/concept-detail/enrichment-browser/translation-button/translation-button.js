'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsTranslationButton', {
    // isolated scope binding
    bindings: {
        concept: "=data",  // concept
        onConfirm: "&"
    },
    templateUrl: "scripts/components/concept-detail/enrichment-browser/translation-button/translation-button.html",

    // The controller that handles our component logic
    controller: function ($scope, ngDialog, LanguageService) {
        var ctrl = this;

        // watcher for data
        $scope.$watchCollection(function() {
            return ctrl.concept;
        }, function() {
            console.log("changed concept");
            // refresh available languages
            ctrl.getUsedLanguages();
        });

        // determine already used languages and block their usage
        this.getUsedLanguages = function() {

            LanguageService.query().then(function(languages) {
                $scope.languages = languages;

                // lock label language
                var langObj = _.find($scope.languages, {value: ctrl.concept.language});
                var index = _.indexOf($scope.languages, langObj);
                langObj.used = true;
                $scope.languages.splice(index, 1, langObj);

                // lock all languages used in translations
                if (ctrl.concept.translations) {
                    angular.forEach(ctrl.concept.translations, function(translation) {

                        //get language object and add new property
                        var langObj = _.find($scope.languages, {value: translation.lang});

                        // update in languages collection
                        var index = _.indexOf($scope.languages, langObj);

                        if (index) {
                            langObj.used = true;
                            $scope.languages.splice(index, 1, langObj);
                        }
                    });
                }

            }, function error(res) {
                console.log(res);
            });

        };

        $scope.openDialog = function() {
            ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/translation-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };
    }
});
