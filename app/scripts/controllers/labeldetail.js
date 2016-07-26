'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabeldetailCtrl
 * @description
 * # LabeldetailCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelDetailCtrl', function ($scope, $routeParams, VocabService, LabelService, ExternalResourcesService) {

    console.log("reload details");
    VocabService.get({id: $routeParams.vID}, function(vocabulary) {
        $scope.vocabulary = vocabulary;
    });

    // load all labels for the current vocabulary
    LabelService.get({id: $routeParams.lID}, function(label) {
        $scope.label = label;

        label.prefLabels.forEach(function(prefLabel) {
            if (prefLabel.isThumbnail) {
                $scope.prefLabel = prefLabel;
            }
        });

        $scope.getLabelRelations(label);
        $scope.getLabelMatches(label);
        $scope.getExternalResources(label);

    });

    $scope.getLabelRelations = function(label) {
        // get all narrower and broader
        $scope.broaderLabels = [];
        if (label.broader) {
            label.broader.forEach(function(broaderID) {
                LabelService.get({id: broaderID}, function(label) {
                    $scope.broaderLabels.push(label);
                });
            });
        }

        $scope.narrowerLabels = [];
        if (label.narrower) {
            label.narrower.forEach(function(narrowerID) {
                LabelService.get({id: narrowerID}, function(label) {
                    $scope.narrowerLabels.push(label);
                });
            });
        }

        $scope.relatedLabels = [];
        if (label.related) {
            label.related.forEach(function(relatedID) {
                LabelService.get({id: relatedID}, function(label) {
                    $scope.relatedLabels.push(label);
                });
            });
        }

    };

    $scope.getLabelMatches = function(label) {

        $scope.broadMatches = [];
        if (label.broadMatch) {
            label.broadMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    $scope.broadMatches.push(resource);
                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }

        $scope.narrowMatches = [];
        if (label.narrowMatch) {
            label.narrowMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    $scope.narrowMatches.push(resource);
                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }

        $scope.closeMatches = [];
        if (label.closeMatch) {
            label.closeMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    $scope.closeMatches.push(resource);
                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }

        $scope.relatedMatches = [];
        if (label.relatedMatch) {
            label.relatedMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    $scope.relatedMatches.push(resource);
                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }

        $scope.exactMatches = [];
        if (label.exactMatch) {
            label.exactMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    $scope.exactMatches.push(resource);
                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }
    };

    $scope.getExternalResources = function(label) {
        $scope.seeAlsoResources = [];
        if (label.seeAlso) {
            label.seeAlso.forEach(function(resource) {
                ExternalResourcesService.get(resource.url, function(externalResource) {
                    $scope.seeAlsoResources.push(externalResource);
                }, function(errorMessage) {
                    // failure
                    console.log(errorMessage);
                });
            });
        }
    };
  });
