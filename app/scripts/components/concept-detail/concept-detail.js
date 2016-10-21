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

    controller: function ($scope, $routeParams, $timeout, $location, $http, $document, ngDialog, AuthService, VocabService, LabelService, ResourcesService, TooltipService, SearchService) {

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

        $scope.addTranslation = function(term, lang) {

            if (!$scope.label.translations) {
                $scope.label.translations = [];
            }
            $scope.label.translations.push({
                value: term,
                lang: lang
            });

            $scope.label.save(function() {
                // success
            }, function() {
                // error
            });
        };

        /**
         * Adds a description to the current concept.
         */
        $scope.addDescription = function(value) {
            $scope.label.description = value;
            $scope.label.save(function() {
                // success
            }, function(res) {
                // error
                console.log(res);
            });
        };

        $scope.addLink = function(uri) {
            $scope.label.addChild({ uri: uri}, "seeAlso");
            $scope.label.save(function() {
                // success
            }, function error(res) {
                console.log(res);
            });
        };

        // temporarily add box when new resource was addedd
        $scope.$on("addedResource", function(event, data) {
            if (!$scope.label[data.relation]) {
                $scope.label[data.relation] = [];
            }
            $scope.label[data.relation].push(data.resource);
        });

        // init nano-scroller (gets refreshed in directives after render)
        $(".nano").nanoScroller();
    }
});
