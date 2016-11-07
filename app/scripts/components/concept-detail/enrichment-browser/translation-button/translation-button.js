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
    controller: ["$scope", "$rootScope", "$routeParams", "ngDialog", "LabelService", "LanguageService", function($scope, $rootScope, $routeParams, ngDialog, LabelService, LanguageService) {
        var ctrl = this;

        function lock(languages, language) {
            var langObj = _.find(languages, {value: language});
            var index = _.indexOf(languages, langObj);
            langObj.used = true;
            languages.splice(index, 1, langObj);
            return languages;
        }

        function unlock(languages, language) {
            var langObj = _.find(languages, {value: language});
            var index = _.indexOf(languages, langObj);
            langObj.used = false;
            languages.splice(index, 1, langObj);
            return languages;
        }

        ctrl.$onInit = function() {
            LabelService.get({ id: $routeParams.lID }, function success(concept) {
                ctrl.concept = concept;
                ctrl.lookUsedLanguages();
            });
        };

        ctrl.lookUsedLanguages = function() {
            // determine already used languages and block their usage
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
            //ctrl.lookUsedLanguages();
            $scope.newTranslation = {};
            ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/translation-button/dialog.html',
                className: 'bigdialog smallheightdialog',
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.addTranslation = function() {
            $rootScope.$broadcast("addedTranslation", { translation: $scope.newTranslation });
            $scope.languages = lock($scope.languages, $scope.newTranslation.lang);
        };

        $scope.$on("removedTranslation", function(event, data) {
            $scope.languages = unlock($scope.languages, data.translation.lang);
        });
    }]
});
