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

    controller: function ($scope, $location, LabelService, FilterService) {
        $scope.placeholder = "loading labels ...";
        LabelService.query(function(labels) {
            //console.log(labels);
            $scope.labels = labels;
            $scope.placeholder = "search labels";

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
