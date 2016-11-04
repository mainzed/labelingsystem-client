'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsConceptDetail', {
    bindings: {
    },
    templateUrl: "scripts/components/concept-detail/concept-detail.html",

    controller: ["$scope", "$routeParams", "VocabService", "LabelService", "TooltipService", "HelperService", "CachingService", function($scope, $routeParams, VocabService, LabelService, TooltipService, HelperService, CachingService) {

        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;
            $scope.vocabulary = VocabService.get({id: $routeParams.vID});
            $scope.label = LabelService.get({id: $routeParams.lID});

            if (CachingService.editor.showEnrichments === false) {
                ctrl.showEnrichments = CachingService.editor.showEnrichments;
            } else {
                ctrl.showEnrichments = true;
            }

            HelperService.refreshNanoScroller();
        }

        ctrl.$onDestroy = function() {
            CachingService.editor.showEnrichments = ctrl.showEnrichments;
        }

        $scope.$on("removedConcept", function(event, data) {
            // TODO: implement removeChild() method for concepts
            // that can handle both resources and concepts
            $scope.label[data.relation] = _.pull($scope.label[data.relation], data.conceptID);

            $scope.label.save(function() {
                // success
            });
        });

        $scope.$on("addedResource", function(event, data) {
            $scope.label.addChild(data.concept, data.relation);
            $scope.label.save(function() {
                // success
            });
        });

        $scope.$on("addedWaybackLink", function(event, data) {
            $scope.label.addChild({ uri: data.uri }, "seeAlso");
            $scope.label.save(function() {
                // success
            });
        });

        $scope.$on("changedConcept", function(event, data) {
            // remove id from old relation array
            _.remove($scope.label[data.oldRelation], function(n) {
                return n === data.concept.id;
            });

            // add concept ID to new relation array
            $scope.label[data.newRelation] = $scope.label[data.newRelation] || [];
            $scope.label[data.newRelation].push(data.concept.id);

            $scope.label.save(function() {
                //console.log("success");
            }, function error(res) {
                console.log(res);
            });
        });

        $scope.$on("removedResource", function(event, data) {
            _.remove($scope.label[data.relation], { "uri": data.resourceURI });
            $scope.label.save(function() {
                // console.log("success");
            }, function error(res) {
                console.log(res);
            });
        });

        $scope.$on("addedTranslation", function(event, data) {
            if (!$scope.label.translations) {
                $scope.label.translations = [];
            }
            $scope.label.translations.push(data.translation);

            $scope.label.save(function() {
                // console.log("success");
            }, function error(res) {
                console.log(res);
            });
        });

        $scope.$on("removedTranslation", function(event, data) {
            _.remove($scope.label.translations, { value: data.translation.value, lang: data.translation.lang });
        });

        $scope.$on("addedDescription", function(event, data) {
            $scope.label.description = data.description;
        });

        $scope.$on("removedDescription", function(event) {
            console.log("inside!!!");
            delete $scope.label["description"];

            console.log($scope.label);
            $scope.label.save(function() {
                //
            }, function error(res) {
                console.log(res);
            });
        });

        $scope.$on("changedDescription", function(event, data) {
            $scope.label.description = data.newDescription;
            $scope.label.save(function() {
                //
            }, function error(res) {
                console.log(res);
            });
        });

        $scope.$on("addedLink", function(event, data) {
            console.log("added link!");
        });

        $scope.$on("changedRelation", function(event, data) {

            // get resource
            var query = { uri: data.resource.uri };
            var resource = _.find($scope.label[data.oldRelation], query);

            // remove it from the array (e.g. remove a narrowMatch from the narrowWatch array)
            _.remove($scope.label[data.oldRelation], query);

            // push resource to the corresponding array (e.g. to the broaderMatch array)
            if (!$scope.label[data.newRelation]) {
                $scope.label[data.newRelation] = [];
            }
            $scope.label[data.newRelation].push({
                type: data.resource.type,
                uri: data.resource.uri
            });

            $scope.label.save(function() {
                // console.log("success");
            }, function error(res) {
                console.log(res);
            });

        });

        $scope.$on("toggledEnrichmentBrowser", function(event, data) {
            ctrl.showEnrichments = data.visible;
            CachingService.editor.showEnrichments = ctrl.showEnrichments;
            HelperService.refreshNanoScroller();
        });
    }]
});
