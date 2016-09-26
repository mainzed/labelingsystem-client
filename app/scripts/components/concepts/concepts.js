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

        //$scope.user = AuthService.getUser();

        // initial values
        $scope.tooltips = TooltipService;
        $scope.placeholder = "loading labels...";
        $scope.extendAll = UserSettingsService.extendAll;
        $scope.conceptsLimit = ConfigService.conceptsLimit;

        VocabService.get({id: $routeParams.vID}, function(vocabulary) {
            $scope.vocabulary = vocabulary;

            ThesauriService.query({id: vocabulary.id}, function(thesauri) {
                $scope.thesauri = thesauri;

            }, function(err) {
                console.log(err);
            });
        });

        // load all labels for the current vocabulary
        LabelService.query({'vocab': $routeParams.vID}, function(labels) {
            $scope.labels = labels;
            $scope.placeholder = "filter";
        });

        /**
         * Creates a new label by sending a new label object to the api.
         * @param {string} term - The new label's thumbnail prefLabel
         * @param {string} description - The new label's scopeNote of the new label
         */
        $scope.createLabel = function(term, description) {

            var newLabel = {
                "vocabID": $scope.vocabulary.id,
                "prefLabels": [{
                    "isThumbnail": true,
                    "lang": $scope.vocabulary.title.lang,
                    "value": term
                }]
            };

            if (description) {
                newLabel.scopeNote = {
                    value: description,
                    lang: $scope.vocabulary.title.lang,
                };
            }

            LabelService.save({
                item: newLabel,
                user: $scope.user.name
            }, function(label) {
                if (label.id) {
                    //$scope.labels.push(label);
                    //console.log("/admin/vocabularies/" + $routeParams.vID + "/concepts/" + label.id);
                    $location.path("/admin/vocabularies/" + $routeParams.vID + "/concepts/" + label.id);
                }
            });
        };

        /**
         * Order function for the use with the ng-repeat directive to order labels
         * alphabetically by their thumbnail prefLabel by returning their charCode
         * number.
         * @param {object} concept
         * @returns {String}
         */
        $scope.orderByLabel = function(concept) {
            return concept.getLabel().value;
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
    }
});
