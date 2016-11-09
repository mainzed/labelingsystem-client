"use strict";

/**
* @ngdoc directive
* @name labelsApp.lsLanding
* @description
* asd asd as dasd
*/
angular.module("labelsApp")
    .component("lsLanding", {
        bindings: {},
        templateUrl: "scripts/components/landing/landing.html",
        controller: ["$scope", "$timeout", "ConceptService", "CachingService", "ConfigService", function($scope, $timeout, ConceptService, CachingService, ConfigService) {
            var ctrl = this;

            ctrl.$onInit = function() {
                ctrl.resultsLimit = ConfigService.conceptsLimit;
                $scope.conceptOrder = "-lastModified";

                $scope.loading = false;
                // get from cache or load new
                if (CachingService.viewer.allConcepts) {  // already cached
                    ctrl.labels = CachingService.viewer.allConcepts;
                } else {
                    $scope.loading = true;
                    ConceptService.queryPublic(function(labels) {
                        ctrl.labels = labels;

                        // save for later
                        CachingService.viewer.allConcepts = labels;
                        $scope.loading = false;
                    });
                }

                angular.element(".nano").nanoScroller();
            };

            ctrl.$onDestroy = function() {
                CachingService.viewer.filterValue = $scope.filterValue;
            };

            ctrl.toggleExtent = function() {
                $scope.extendAll = !$scope.extendAll;
            };

            // focus when loading complete
            $scope.$watch("loading", function(loading) {
                if (loading) {
                    $scope.placeholder = "loading labels ...";
                } else {
                    $timeout(function() {
                        $scope.placeholder = "search labels";
                        angular.element("#labelSearch").focus();
                    }, 0);
                }
            });

            // $scope.highlightResult = function(labelName, search) {
            //     if (labelName) {
            //         var re = new RegExp(search, "i");  // gi makes it case insensitive
            //         var match = labelName.match(re);  // find case sensitive to replace
            //         return labelName.replace(re, "<span class='highlight'>" + match + "</span>");
            //     } else {
            //         return false;
            //     }
            // };
        }]
    });
