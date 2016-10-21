'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsConceptDetail', {
    bindings: {
    },
    templateUrl: "scripts/components/concept-detail/concept-detail.html",

    controller: function ($scope, $routeParams, VocabService, LabelService, TooltipService) {

        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;
            $scope.vocabulary = VocabService.get({id: $routeParams.vID});
            $scope.label = LabelService.get({id: $routeParams.lID});

            $(".nano").nanoScroller();
        }

        // temporarily add box when new resource was addedd
        $scope.$on("addedResource", function(event, data) {
            if (!$scope.label[data.relation]) {
                $scope.label[data.relation] = [];
            }
            $scope.label[data.relation].push(data.resource);
        });

        $scope.$on("addedTranslation", function(event, data) {
            if (!$scope.label.translations) {
                $scope.label.translations = [];
            }
            $scope.label.translations.push(data.translation);
        });

        $scope.$on("addedDescription", function(event, data) {
            console.log("added description!");
        });

        $scope.$on("addedLink", function(event, data) {
            console.log("added link!");
        });
    }
});
