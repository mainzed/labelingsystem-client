"use strict";

/**
 * @ngdoc directive
 * @name labelsApp.directive:lsBreadcrumbs
 * @description
 * # breadcrumb
 */
angular.module("labelsApp")
    .component("lsBreadcrumbs", {
        bindings: {
            mode: "@"
        },
        templateUrl: "scripts/components/shared/breadcrumbs/breadcrumbs.html",
        controller: ["$scope", "$location", "$routeParams", "VocabService", function($scope, $location, $routeParams, VocabService) {
            var ctrl = this;

            ctrl.$onInit = function() {
                ctrl.vocabID = $routeParams.vID;
                ctrl.conceptID = $routeParams.lID;

                // get vocab title
                if (ctrl.vocabID) {
                    ctrl.vocab = VocabService.get({ id: ctrl.vocabID });
                }
            };
        }]
    });
