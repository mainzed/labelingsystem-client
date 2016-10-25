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

            angular.element(".nano").nanoScroller();
        }

        // temporarily add box when new resource was addedd
        $scope.$on("addedResource", function(event, data) {
            $scope.label.addChild(data.concept, data.relation);
            $scope.label.save(function() {
                //
            });
        });

        $scope.$on("removedResource", function(event, data) {
            _.remove($scope.label[data.relation], { "uri": data.resourceURI });
        });

        $scope.$on("addedTranslation", function(event, data) {
            if (!$scope.label.translations) {
                $scope.label.translations = [];
            }
            $scope.label.translations.push(data.translation);
        });

        $scope.$on("removedTranslation", function(event, data) {
            _.remove($scope.label.translations, { value: data.translation.value, lang: data.translation.lang });
        });

        $scope.$on("addedDescription", function(event, data) {
            $scope.label.description = data.description;
        });

        $scope.$on("removedDescription", function(event) {
            delete $scope.label.description;
        });

        $scope.$on("addedLink", function(event, data) {
            console.log("added link!");
        });
    }
});
