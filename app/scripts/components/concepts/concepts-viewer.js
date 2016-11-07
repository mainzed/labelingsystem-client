'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsConceptsViewer', {
    bindings: {
    },
    templateUrl: "scripts/components/concepts/concepts-viewer.html",
    controller: ["$scope", "$timeout", "$routeParams", "$location", "LabelService", "VocabService", "TooltipService", "ConfigService", "CachingService", "AgentService", "LicenseService", function($scope, $timeout, $routeParams, $location, LabelService, VocabService, TooltipService, ConfigService, CachingService, AgentService, LicenseService) {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.license = null;

            ctrl.loading = true;
            $scope.tooltips = TooltipService;
            $scope.extendAll = false;

            $scope.labelOrder = '-lastModified';

            $scope.conceptsLimit = ConfigService.conceptsLimit;
            ctrl.vocabID = $routeParams.vID;

            // TODO: load currentVocab from cache
            VocabService.get({id: $routeParams.vID}, function(vocabulary) {
                $scope.vocabulary = vocabulary;

                // creator info
                AgentService.get({id: $scope.vocabulary.creator}, function(agent) {
                    $scope.agent = agent;
                });

                LicenseService.query({}, function(licenses) {
                    ctrl.license = _.find(licenses, { link: $scope.vocabulary.license });
                });
            });

            // load filter from cache of possible
            $scope.labelFilter = CachingService.getFilterByVocab(ctrl.vocabID);

            // get from cache or server
            if (CachingService.editor.concepts && CachingService.editor.concepts.vocabID === $routeParams.vID) {
                // cached concepts are for the current vocab
                $scope.labels = CachingService.editor.concepts.items;
                ctrl.loading = false;
            } else {
                ctrl.loadConcepts();
            }

            // cache all concepts for landing page (if user clicks on search icon)
            if (!CachingService.viewer.allConcepts) {
                LabelService.query(function(concepts) {
                    CachingService.viewer.allConcepts = concepts;
                });
            }

            $(".nano").nanoScroller();
        };

        ctrl.$onDestroy = function () {
            // cache filter value
            if ($scope.labelFilter) {
                CachingService.filters.concepts = {
                    vocabID: ctrl.vocabID,
                    value: $scope.labelFilter
                };
            };

            // cache concepts. doing this on destroy saves us from having to
            // update the cache when adding or removing concepts
            CachingService.editor.concepts = {
                vocabID: ctrl.vocabID,
                items: $scope.labels
            };
        };

        ctrl.loadConcepts = function() {
            LabelService.query({'vocab': $routeParams.vID}, function(labels) {
                $scope.labels = labels;
                ctrl.loading = false;
            });
        };

        $scope.toggleExtent = function() {
            $scope.extendAll = !$scope.extendAll;
        };

        $scope.onSearchClick = function() {
            $location.path("/search");
        };

        $scope.$watch("ctrl.loading", function(loading) {
            if (!loading) {
                $timeout(function() {
                    angular.element('#filtersearch input').focus();
                }, 0);
            }
        });
    }]
});
