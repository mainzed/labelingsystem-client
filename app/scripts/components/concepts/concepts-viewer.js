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
    controller: function ($scope, $timeout, $routeParams, $location, ngDialog, AuthService, LabelService, ThesauriService, VocabService, TooltipService, ConfigService, UserSettingsService, CachingService) {
        var ctrl = this;
        // init nanoscroller here to prevent default scrollbar while loading boxes
        $(".nano").nanoScroller();

        // initial values
        $scope.loading = true;
        $scope.tooltips = TooltipService;

        $scope.extendAll = UserSettingsService.extendAll;
        $scope.conceptsLimit = ConfigService.conceptsLimit;

        VocabService.get({id: $routeParams.vID}, function(vocabulary) {
            $scope.vocabulary = vocabulary;
        });

        if (CachingService.filters.concepts && CachingService.filters.concepts.vocabID === $routeParams.vID) {
            $scope.labelFilter = CachingService.filters.concepts.value;
        }

        // get from cache or server
        if (CachingService.viewer.concepts && CachingService.viewer.concepts.vocabID === $routeParams.vID) {
            $scope.labels = CachingService.viewer.concepts.items;
            $scope.loading = false;
        } else {
            LabelService.query({'vocab': $routeParams.vID}, function(labels) {
                $scope.labels = labels;
                CachingService.viewer.concepts = {
                    vocabID: $routeParams.vID,
                    items: labels
                };

                $scope.loading = false;
            });
        }

        // cache all concepts for landing page (if user clicks on search icon)
        if (!CachingService.viewer.allConcepts) {
            LabelService.query(function(concepts) {
                CachingService.viewer.allConcepts = concepts;
            });
        }

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

        $scope.$on("leaveConcepts", function() {
            CachingService.filters.concepts.vocabID = $routeParams.vID;
            CachingService.filters.concepts.value = $scope.labelFilter;
        });

    }
});
