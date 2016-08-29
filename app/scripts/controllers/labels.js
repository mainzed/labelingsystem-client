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
        //console.log(labels);

        $scope.placeholder = "filter";
    });

    $scope.onLabelClick = function(id) {
        $location.path("admin/vocabularies/" + $scope.vocabulary.id + "/labels/" + id);
    };
    $scope.onCreateLabelClick = function() {
        ///labels/user/:user
        //console.log("create label!");

        ngDialog.open({
            template: 'views/dialogs/create-label.html',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            scope: $scope
        });

        $scope.onCreateLabelConfirm = function(term) {

            var newLabel = {
                "vocabID": $scope.vocabulary.id,
                "prefLabels": [{
                    "isThumbnail": true,
                    "lang": $scope.vocabulary.title.lang,
                    "value": term
                }]
            };

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

  });
