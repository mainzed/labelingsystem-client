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

    controller: function ($scope, $window, $timeout, $location, LabelService, FilterService) {
        $scope.placeholder = "loading labels ...";
        $scope.loading = true;

        LabelService.query(function(labels) {
            $scope.labels = labels;
            $scope.loading = false;
            $scope.placeholder = "search labels";
        });

        // focus when loading complete
        $scope.$watch("loading", function(loading) {
            if (!loading) {
                $timeout(function() {
                    $window.document.getElementById("labelSearch").focus();
                }, 0);
            }
        });

        $scope.labelFilter = FilterService.getSearchFilter();

        $scope.$watch('labelFilter', function(newValue) {
            FilterService.setSearchFilter(newValue);
        });

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
