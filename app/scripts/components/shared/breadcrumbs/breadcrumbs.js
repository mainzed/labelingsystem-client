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
                console.log(ctrl.mode);
                $scope.vocabID = $routeParams.vID;
                $scope.conceptID = $routeParams.lID;

                // get vocab title
                if ($scope.vocabID) {
                    $scope.vocab = VocabService.get({ id: $scope.vocabID });
                }
            };
        }]
    });
