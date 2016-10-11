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
    controller: function ($scope, $timeout, $routeParams, $location, ngDialog, AuthService, LabelService, ThesauriService, VocabService, TooltipService, ConfigService, UserSettingsService, CachingService, AgentService) {
        var ctrl = this;

        var ctrl = this;

        ctrl.$onInit = function () {
            $scope.loading = true;
            $scope.tooltips = TooltipService;
            $scope.placeholder = "loading labels...";
            $scope.extendAll = UserSettingsService.extendAll;
            $scope.conceptsLimit = ConfigService.conceptsLimit;
            ctrl.vocabID = $routeParams.vID;

            // init nanoscroller here to prevent default scrollbar while loading boxes
            $(".nano").nanoScroller();

            // TODO: load currentVocab from cache
            VocabService.get({id: $routeParams.vID}, function(vocabulary) {
                $scope.vocabulary = vocabulary;
                //console.log($scope.vocabulary);

                // creator info
                AgentService.get({id: $scope.vocabulary.creator}, function(agent) {
                    $scope.agent = agent;
                });
            });

            // load filter from cache of possible
            $scope.labelFilter = CachingService.getFilterByVocab(ctrl.vocabID);

            // get from cache or server
            if (CachingService.editor.concepts && CachingService.editor.concepts.vocabID === $routeParams.vID) {
                // cached concepts are for the current vocab
                $scope.labels = CachingService.editor.concepts.items;
                $scope.loading = false;
                $scope.placeholder = "filter";
            } else {
                ctrl.loadConcepts();
            }

            // cache all concepts for landing page (if user clicks on search icon)
            if (!CachingService.viewer.allConcepts) {
                LabelService.query(function(concepts) {
                    CachingService.viewer.allConcepts = concepts;
                });
            }
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
        };

        ctrl.loadConcepts = function() {
            LabelService.query({'vocab': $routeParams.vID}, function(labels) {
                $scope.labels = labels;
                $scope.loading = false;
                $scope.placeholder = "filter";
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

        /**
         * Watch if boxes are extended or not and updated text accordingly.
         */
        $scope.$watch("extendAll", function(newVal) {
            // update service
            UserSettingsService.extendAll = $scope.extendAll;

            // update button text
            if (newVal) {
                $scope.extendButtonText = "collapse all";
            } else {
                $scope.extendButtonText = "extend all";
            }
        });

        // set inital labelOrder to a function, has to be defined before this line
        // TODO: sort button highlights dont work because of the returned functions
        $scope.labelOrder = UserSettingsService.labelOrder || $scope.orderByThumbnail;

        $scope.onSearchClick = function() {
            $location.path("/");
        };

        $scope.$watch("loading", function(loading) {
            if (loading) {
                $scope.placeholder = "loading labels...";

            } else {
                $timeout(function() {
                    $scope.placeholder = "filter";
                    angular.element('#filtersearch input').focus();
                }, 0);
            }
        });
    }
});
