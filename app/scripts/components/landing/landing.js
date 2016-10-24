'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:smallBox
* @description
* # smallBox
*/
angular.module('labelsApp')
.component('lsLanding', {
    bindings: {
    },
    templateUrl: "scripts/components/landing/landing.html",

    controller: function ($scope, $window, $filter, $timeout, $location, LabelService, FilterService, CachingService, ConfigService) {

        var ctrl = this;

        ctrl.$onInit = function() {
            //ctrl.resultsLimit = 0;
            ctrl.resultsLimit = ConfigService.conceptsLimit;
            $scope.extendAll = CachingService.toggles.extendAll || false;

            $scope.loading = false;
            // get from cache or load new
            if (CachingService.viewer.allConcepts) {  // already cached
                $scope.labels = CachingService.viewer.allConcepts;
            } else {
                $scope.loading = true;
                LabelService.queryPublic(function(labels) {
                    $scope.labels = labels;
                    CachingService.viewer.allConcepts = labels;
                    $scope.loading = false;
                });
            }

            $(".nano").nanoScroller();
        };

        ctrl.toggleExtent = function() {
            $scope.extendAll = !$scope.extendAll;
        }

        /**
         * Order function for the use with the ng-repeat directive. Grades a label
         * by how many connections it has to internal or external resources.
         * @param {object} concept
         * @returns {number}
         */
        ctrl.orderByQuality = function(concept) {
            return -1 * concept.getScore();
        };

        // focus when loading complete
        $scope.$watch("loading", function(loading) {
            if (loading) {
                $scope.placeholder = "loading labels ...";
            } else {
                $timeout(function() {
                    $scope.placeholder = "search labels";
                    $window.document.getElementById("labelSearch").focus();
                }, 0);
            }
        });

        // filter in controller to improve speed


        // $scope.labelFilter = FilterService.getSearchFilter();
        //
        // $scope.$watch('labelFilter', function(newValue) {
        //     FilterService.setSearchFilter(newValue);
        // });

        $scope.highlightResult = function(labelName, search) {
            if (labelName) {
                var re = new RegExp(search, "i");  // gi makes it case insensitive
                var match = labelName.match(re);  // find case sensitive to replace
                return labelName.replace(re, '<span class="highlight">' + match + '</span>');
            } else {
                return false;
            }
        };

    }
});
