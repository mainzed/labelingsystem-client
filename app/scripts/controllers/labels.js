'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabelsCtrl
 * @description
 * # LabelsCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelsCtrl', function ($scope, $routeParams, $location, ngDialog, AuthService, LabelService, ThesauriService, VocabService, TooltipService, ConfigService) {

    // init nanoscroller here to prevent default scrollbar while loading boxes
    $(".nano").nanoScroller();

    // authentication
    if ($location.path().indexOf("admin/") > -1) {  // is admin view
        if (!AuthService.getUser()) {
            // redirect if not logged in
            $location.path("admin/login");
        } else {
            // if logged in, get user name
            $scope.user = AuthService.getUser();
        }
    }

    $scope.tooltips = TooltipService;

    $scope.placeholder = "loading labels...";

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
     * Toggles (collapses or extends) all list boxes by setting a variable they
     * all share.
     */
    $scope.onExtendClick = function() {
        $scope.extentAll = !$scope.extentAll;
        if ($scope.extentAll) {
            $scope.collapseText = "collapse all";
        } else {
            $scope.collapseText = "";
        }
    };

    /**
     * Opens the metadata/settings dialog of a vocabulary.
     */
    $scope.openVocabDialog = function() {
        ngDialog.open({
            template: 'views/dialogs/vocab-metadata.html',
            className: 'bigdialog',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            controller: 'VocabDialogCtrl',
            scope: $scope
        });
    };

    /**
     * Opens a dialog to create a new label.
     */
    $scope.onCreateLabelClick = function() {
        ngDialog.open({
            template: 'views/dialogs/create-label.html',
            className: 'bigdialog',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            scope: $scope
        });
    };

    /**
     * Creates a new label by sending a new label object to the api.
     * @param {string} term - The new label's thumbnail prefLabel
     * @param {string} description - The new label's scopeNote of the new label
     */
    $scope.onCreateLabelConfirm = function(term, description) {

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
     * @param {object} label - Label object
     * @returns {number}
     */
    $scope.orderByThumbnail = function(label) {
        if (label.prefLabels) {
            for (var i = 0; i < label.prefLabels.length; i++) {
                if (label.prefLabels[i].isThumbnail) {
                    var thumbnail = label.prefLabels[i];
                    var name = thumbnail.value.toLowerCase();
                    return name.charCodeAt(0);
                }
            }
        } else {
            return -9999;
        }
    };

    /**
     * Order function for the use with the ng-repeat directive. Grades a label
     * by how many connections it has to internal or external resources.
     * @param {object} label - Label object
     * @returns {number}
     */
    $scope.orderByQuality = function(label) {

        var matchTypes = [
            "closeMatch",
            "exactMatch",
            "relatedMatch",
            "broadMatch",
            "narrowMatch"
        ];

        var qualityScore = 0;

        // gray boxes
        if (label.prefLabels) {
            qualityScore += label.prefLabels.length * ConfigService.scores.prefLabel;
        }
        if (label.altLabels) {
            qualityScore += label.altLabels.length * ConfigService.scores.altLabel;
        }
        if (label.scopeNote) {
            qualityScore += ConfigService.scores.scopeNote;
        }
        if (label.seeAlso) {
            qualityScore += ConfigService.scores.wayback;
        }

        // blue and green boxes
        matchTypes.forEach(function(matchType) {
            qualityScore += getMatchScore(matchType);
        });

        // blue boxes
        if (label.broader) {
            qualityScore += label.broader.length * ConfigService.scores.concept;
        }
        if (label.related) {
            qualityScore += label.related.length * ConfigService.scores.concept;
        }
        if (label.narrower) {
            qualityScore += label.narrower.length * ConfigService.scores.concept;
        }

        function getMatchScore(matchType) {
            var score = 0;
            if (label[matchType]) {
                label[matchType].forEach(function(match) {
                    if (ConfigService.scores[match.type]) {
                        score += ConfigService.scores[match.type];
                    } else {
                        console.log("unknown match type: " + match.type + ". add score for this type in ConfigService!");
                    }
                });
            }
            return score;
        }

        //console.log(qualityScore);
        return -1 * qualityScore;
    };

  });
