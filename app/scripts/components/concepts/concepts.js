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
    controller: function ($scope, $routeParams, $location, ngDialog, AuthService, LabelService, ThesauriService, VocabService, TooltipService, ConfigService, UserSettingsService) {

        // init nanoscroller here to prevent default scrollbar while loading boxes
        $(".nano").nanoScroller();

        // initial values
        $scope.loading = true;
        $scope.tooltips = TooltipService;
        $scope.placeholder = "loading labels...";
        $scope.extendAll = UserSettingsService.extendAll;
        $scope.conceptsLimit = ConfigService.conceptsLimit;

        VocabService.get({id: $routeParams.vID}, function(vocabulary) {
            $scope.vocabulary = vocabulary;
        });

        // load all labels for the current vocabulary
        LabelService.query({'vocab': $routeParams.vID}, function(labels) {
            $scope.labels = labels;
            $scope.placeholder = "filter";
            $scope.loading = false;
        });

        /**
         * Order function for the use with the ng-repeat directive.
         * @param {object} concept
         * @returns {String}
         */
        $scope.orderByLabel = function(concept) {
            return concept.thumbnail;
        };


        /**
         * Creates a new concept by sending a new object to the api.
         * @param {Object} newConcept
         */
        $scope.createConcept = function(newConcept) {

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

        // refresh boxes when csv upload complete
        $scope.$on("csvUploadComplete", function() {
            console.log("csv complete!!!");
            $scope.labels = LabelService.query({'vocab': $routeParams.vID});
        });

        // set inital labelOrder to a function, has to be defined before this line
        // TODO: sort button highlights dont work because of the returned functions
        $scope.labelOrder = UserSettingsService.labelOrder || $scope.orderByThumbnail;

    }
});
