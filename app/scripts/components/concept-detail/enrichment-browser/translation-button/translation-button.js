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
        //concept: '=data',  // concept
        onConfirm: '&'
    },
    templateUrl: 'scripts/components/concept-detail/enrichment-browser/translation-button/translation-button.html',

    // The controller that handles our component logic
    controller: function ($scope, $routeParams, ngDialog, LabelService, LanguageService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            LabelService.get({ id: $routeParams.lID }, function success(concept) {
                ctrl.concept = concept;
            });
        };

        // determine already used languages and block their usage
        ctrl.lookUsedLanguages = function() {
            function lock(languages, language) {
                var langObj = _.find(languages, {value: language});
                var index = _.indexOf(languages, langObj);
                langObj.used = true;
                languages.splice(index, 1, langObj);
                return languages;
            }

            LanguageService.query().then(function(languages) {
                $scope.languages = languages;

                // lock label language
                $scope.languages = lock($scope.languages, ctrl.concept.language);

                // lock all languages used in translations
                if (ctrl.concept.translations) {
                    angular.forEach(ctrl.concept.translations, function(translation) {
                        $scope.languages = lock($scope.languages, translation.lang);
                    });
                }

            }, function error(res) {
                console.log(res);
            });

        };

        ctrl.openDialog = function() {

            ctrl.lookUsedLanguages();
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
