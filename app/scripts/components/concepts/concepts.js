'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsConcepts', {
    bindings: {
    },
    templateUrl: "scripts/components/concepts/concepts.html",
    controller: function ($scope, $routeParams, $location, ngDialog, AuthService, LabelService, ThesauriService, VocabService, TooltipService, ConfigService, UserSettingsService, $timeout, CachingService) {
        var ctrl = this;

        ctrl.loading = null;
        ctrl.showMoreIsVisible = false;

        ctrl.$onInit = function () {
            ctrl.loading = true;
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
            });

            // load filter from cache of possible
            $scope.labelFilter = CachingService.getFilterByVocab(ctrl.vocabID);

            // get from cache or server
            if (CachingService.editor.concepts && CachingService.editor.concepts.vocabID === $routeParams.vID) {
                // cached concepts are for the current vocab
                $scope.labels = CachingService.editor.concepts.items;
                ctrl.loading = false;
                $scope.placeholder = "filter";
            } else {
                ctrl.loadConcepts();
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

            // cache extend settings

            // cache concepts. doing this on destroy saves us from having to
            // update the cache when adding or removing concepts
            CachingService.editor.concepts = {
                vocabID: ctrl.vocabID,
                items: $scope.labels
            };
        };

        ctrl.loadConcepts = function() {
            ctrl.loading = true;
            LabelService.query({'vocab': $routeParams.vID}, function(labels) {
                $scope.labels = labels;
                ctrl.loading = false;
            });
        };

        /**
         * Creates a new concept by sending a new object to the api.
         * @param {Object} newConcept
         */
        $scope.createConcept = function(newConcept) {
            delete newConcept.thumbnailConfirm;
            newConcept.creator = AuthService.getUser().id;
            newConcept.vocabID = $scope.vocabulary.id;
            newConcept.language = $scope.vocabulary.language;

            if (newConcept.description.length < 1) {
                delete newConcept.description;
            }

            LabelService.save(newConcept, function(concept) {
                if (concept.id) {
                    $scope.labels.push(concept);
                }
            }, function error(res) {
                console.log(res);
            });
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

        ctrl.toggleExtent = function() {
            $scope.extendAll = !$scope.extendAll;
        }

        // refresh boxes when csv upload complete
        $scope.$on("csvUploadComplete", function() {
            ctrl.loadConcepts();
        });

        $scope.$on("removedConcept", function(event, data) {
            _.remove($scope.labels, { id: data.id });
        });

        $scope.$watch("loading", function(loading) {
            if (!loading) {
                $timeout(function() {
                    angular.element('#filtersearch input').focus();
                }, 0);
            }
        });

        // set inital labelOrder to a function, has to be defined before this line
        // TODO: sort button highlights dont work because of the returned functions
        $scope.labelOrder = UserSettingsService.labelOrder;
    }
});
