"use strict";

/**
 * @ngdoc directive
 * @name labelsApp.directive:lsCreateVocabButton
 * @description
 * # smallBox
 */
angular.module("labelsApp")
.component("lsCreateVocabButton", {
    bindings: {},
    template: "<span type='button' class='plusposition' ng-click='$ctrl.openDialog()'>+</span>",
    controller: ["$scope", "$rootScope", "ngDialog", "ConfigService", "LanguageService", "AuthService", "LicenseService", function($scope, $rootScope, ngDialog, ConfigService, LanguageService, AuthService, LicenseService) {
        var ctrl = this;

        ctrl.license = null;
        ctrl.licenses = null;
        ctrl.dialog = null;

        ctrl.$onInit = function() {

            $scope.maxLength = ConfigService.vocabDescriptionLength;
            ctrl.maxTitleLength = ConfigService.vocabTitleLength;

            $scope.languages = LanguageService.query().then(function(languages) {
                $scope.languages = languages;
            }, function(res) {
                console.log(res);
            });

            LicenseService.query({}, function(licenses) {
                ctrl.licenses = licenses;

                // set default license
                angular.forEach(ctrl.licenses, function(license) {
                    if (license.short === "CC BY 4.0") {
                        ctrl.license = license;
                    }
                });
            });
        };

        ctrl.openDialog = function() {

            $scope.newVocab = {
                creator: AuthService.getUser().id,
                title: "",
                description: "",
                language: "",
                license: ""
            };

            ctrl.dialog = ngDialog.open({
                template: "scripts/components/vocabs/create-vocab-button/dialog.html",
                className: "bigdialog",
                showClose: true,
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.updateLicense = function(license) {
            ctrl.license = license;
        };

        ctrl.create = function() {
            $scope.newVocab.license = ctrl.license.link;
            $rootScope.$broadcast("addedVocab", { vocab: $scope.newVocab });
            // ctrl.dialog.close();
        };

        $scope.onDescriptionKeyPress = function(e) {
            if ($scope.newVocab.description.length > ConfigService.vocabDescriptionLength - 1) {
                // prevent new characters from being added
                e.preventDefault();
                // shorten description back to allowed length
                $scope.newVocab.description = $scope.newVocab.description.substring(0, ConfigService.vocabDescriptionLength);
            }
        };
    }]
});
