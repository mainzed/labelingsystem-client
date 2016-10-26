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
    controller: function ($scope, $timeout, $routeParams, $location, ngDialog, AuthService, LabelService, ThesauriService, VocabService, TooltipService, ConfigService, UserSettingsService, CachingService, AgentService, LicenseService) {
        var ctrl = this;

        ctrl.loading = null;
        ctrl.license = null;

        ctrl.$onInit = function () {
            ctrl.loading = true;
            $scope.tooltips = TooltipService;
            $scope.extendAll = CachingService.toggles.extendAll || false;
            $scope.extendButtonText = $scope.extendAll ? "collapse boxes" : "extend boxes";

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
                $scope.loading = false;
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
            }

            // cache concepts. doing this on destroy saves us from having to
            // update the cache when adding or removing concepts
            CachingService.editor.concepts = {
                vocabID: ctrl.vocabID,
                items: $scope.labels
            };

            // cache extent button
            CachingService.toggles.extendAll = $scope.extendAll;
        };

        ctrl.loadConcepts = function() {
            LabelService.query({'vocab': $routeParams.vID}, function(labels) {
                $scope.labels = labels;
                ctrl.loading = false;
            });
        };

        /**
         * Order function for the use with the ng-repeat directive.
         * @param {object} concept
         * @returns {String}
         */
        $scope.orderByLabel = function(concept) {
            return concept.thumbnail;
        };

        /**
         * Order function for the use with the ng-repeat directive. Grades a label
         * by how many connections it has to internal or external resources.
         * @param {object} concept
         * @returns {number}
         */
        $scope.orderByQuality = function(concept) {
            return -1 * concept.getScore();
        };

        // UserSettingsService watchers
        $scope.$watch("labelOrder", function(newValue) {
            UserSettingsService.labelOrder = newValue;
        });

        $scope.toggleExtent = function() {
            $scope.extendAll = !$scope.extendAll;
            $scope.extendButtonText = $scope.extendAll ? "collapse boxes" : "extend boxes";
        }

        // set inital labelOrder to a function, has to be defined before this line
        // TODO: sort button highlights dont work because of the returned functions
        $scope.labelOrder = UserSettingsService.labelOrder || $scope.orderByThumbnail;

        $scope.onSearchClick = function() {
            $location.path("/");
        };

        $scope.$watch("ctrl.loading", function(loading) {
            if (!loading) {
                $timeout(function() {
                    angular.element('#filtersearch input').focus();
                }, 0);
            }
        });
    }
});
