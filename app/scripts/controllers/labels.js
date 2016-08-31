'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabelsCtrl
 * @description
 * # LabelsCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelsCtrl', function ($scope, $routeParams, $location, ngDialog, AuthService, LabelService, VocabService, TooltipService) {

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
    });

    // load all labels for the current vocabulary
    LabelService.query({'vocab': $routeParams.vID}, function(labels) {
        $scope.labels = labels;

        $scope.placeholder = "filter";
    });

    $scope.onExtendClick = function() {
        $scope.extentAll = !$scope.extentAll;
        if ($scope.extentAll) {
            $scope.collapseText = "collapse all";
        } else {
            $scope.collapseText = "";
        }
    };

    $scope.onVocabTitleClick = function() {

        ngDialog.open({
            template: 'views/dialogs/vocab-metadata.html',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            scope: $scope
        });

        $scope.onVocabDeleteClick = function () {
            VocabService.remove({id: $routeParams.vID},  function(res) {
                $location.path("/admin/vocabularies");
            });

        };
    };

    $scope.onLabelClick = function(id) {
        $location.path("admin/vocabularies/" + $scope.vocabulary.id + "/labels/" + id);
    };

    $scope.onCreateLabelClick = function() {

        ngDialog.open({
            template: 'views/dialogs/create-label.html',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            scope: $scope
        });

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
                    $scope.labels.push(label);
                }
            });
        };
    };

    $scope.orderByThumbnail = function(label) {
        //console.log(label.prefLabels.length);
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

    $scope.orderByQuality = function(label) {

        var grayScore = 1;
        var greenScore = 3;
        var blueScore = 5;

        var greenTypes = ["fao", "finto", "dbpedia"];
        var blueTypes = ["ls", "getty", "heritagedata", "chronontology"];

        var qualityScore = 0;

        // gray boxes
        if (label.prefLabels) {
            qualityScore += label.prefLabels.length * grayScore;
        }
        if (label.altLabels) {
            qualityScore += label.altLabels.length * grayScore;
        }
        if (label.scopeNote) {
            qualityScore += grayScore;
        }
        if (label.seeAlso) {
            qualityScore += grayScore;
        }

        if (label.broadMatch) {
            console.log(label.broadMatch[0]);
            //qualityScore += label.broader.length * blueScore;
        }

        if (label.exactMatch) {
            label.exactMatch.forEach(function(match) {
                if (greenTypes.indexOf(match.type) > -1) {
                    qualityScore += greenScore;
                } else if (blueTypes.indexOf(match.type) > -1) {
                    qualityScore += blueScore;
                } else {
                    console.log("unknown score type for: " + match.type);
                }
            });
        }

        if (label.closeMatch) {
            label.closeMatch.forEach(function(match) {
                if (greenTypes.indexOf(match.type) > -1) {
                    qualityScore += greenScore;
                } else if (blueTypes.indexOf(match.type) > -1) {
                    qualityScore += blueScore;
                } else {
                    console.log("unknown score type for: " + match.type);
                }
            });
        }

        if (label.relatedMatch) {
            label.relatedMatch.forEach(function(match) {
                if (greenTypes.indexOf(match.type) > -1) {
                    qualityScore += greenScore;
                } else if (blueTypes.indexOf(match.type) > -1) {
                    qualityScore += blueScore;
                } else {
                    console.log("unknown score type for: " + match.type);
                }
            });
        }

        if (label.broadMatch) {
            label.broadMatch.forEach(function(match) {
                if (greenTypes.indexOf(match.type) > -1) {
                    qualityScore += greenScore;
                } else if (blueTypes.indexOf(match.type) > -1) {
                    qualityScore += blueScore;
                } else {
                    console.log("unknown score type for: " + match.type);
                }
            });
        }

        if (label.narrowMatch) {
            label.narrowMatch.forEach(function(match) {
                if (greenTypes.indexOf(match.type) > -1) {
                    qualityScore += greenScore;
                } else if (blueTypes.indexOf(match.type) > -1) {
                    qualityScore += blueScore;
                } else {
                    console.log("unknown score type for: " + match.type);
                }
            });
        }

        // blue boxes
        if (label.broader) {
            qualityScore += label.broader.length * blueScore;
        }
        if (label.related) {
            qualityScore += label.related.length * blueScore;
        }
        if (label.narrower) {
            qualityScore += label.narrower.length * blueScore;
        }

        //console.log(qualityScore);
        return -1 * qualityScore;

    };

  });
