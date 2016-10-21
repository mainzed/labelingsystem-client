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

    controller: function ($scope, $routeParams, $timeout, $location, $http, $document, ngDialog, AuthService, VocabService, LabelService, ResourcesService, TooltipService) {

        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;

            VocabService.get({id: $routeParams.vID}, function(vocabulary) {
                $scope.vocabulary = vocabulary;
            });

            // load current label
            $scope.label = LabelService.get({id: $routeParams.lID});

            // init nanoscroller here to prevent default scrollbar while loading boxes
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
    }
});
