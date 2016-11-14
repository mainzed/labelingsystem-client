"use strict";

angular.module("labelsApp")
.component("lsLabelBox", {
    bindings: {
        data: "=",  // concept ID
        relation: "@",  // "related", "broader", "narrower"
        parentConcept: "=",  // needed to push updates on relation changes (maybe not)
        mode: "@ "  // viewer
    },
    templateUrl: "scripts/components/concept-detail/label-box/label-box.html",
    controller: ["$scope", "$routeParams", "$location", "$rootScope", "ngDialog", "TooltipService", "ConceptService", function($scope, $routeParams, $location, $rootScope, ngDialog, TooltipService, ConceptService) {
        var ctrl = this;

        var scope = $scope;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;

            // get concept data from ID
            ConceptService.get({id: ctrl.data}, function(concept) {
                $scope.concept = concept;
                ctrl.refreshTemp($scope.concept);
            }, function(err) {
                console.log(err);
            });
        };

        ctrl.refreshTemp = function(concept) {
            function isBiDirectional() {
                return ctrl.relation === "narrower" || ctrl.relation === "broader";
            }

            function isIncluded(concept, relation) {
                return concept[relation] && _.includes(concept[relation], $routeParams.lID)
            }

            var oppositeRelation = null;
            if (isBiDirectional()) {
                oppositeRelation = ctrl.relation === "broader" ? "narrower" : "broader";
            }

            var relation = oppositeRelation || ctrl.relation;
            if (!isIncluded(concept, relation)) {
                // remove just in case
                _.pull(concept["narrower"], $routeParams.lID);
                _.pull(concept["broader"], $routeParams.lID);
                _.pull(concept["related"], $routeParams.lID);

                // add current
                if (!concept[relation]) {
                    concept[relation] = [];
                }
                concept[relation].push($routeParams.lID);
            }
        };

        /**
         * Opens a dialog with detailed information.
         */
        $scope.openDialog = function() {
            if (ctrl.mode === "viewer") {
                var currentPath = $location.path().split("/");
                currentPath.pop();
                currentPath.push(scope.concept.id);
                $location.path(currentPath.join("/"));
            } else {
                $scope.concept.getDetails().then(function(conceptDetails) {
                    scope.conceptDetails = conceptDetails;
                    scope.$apply();
                });

                $scope.conceptDialog = ngDialog.open({
                    template: "scripts/components/concept-detail/label-box/dialog.html",
                    className: "bigdialog",
                    showClose: false,
                    disableAnimation: true,
                    scope: scope
                });
            }
        };

        /**
         * redirect to new concept path
         */
        $scope.openConcept = function() {
            $location.path("/editor/vocabularies/" + $scope.concept.vocabID + "/concepts/" + $scope.concept.id);
        };

        /**
         * Deletes the selected resource, description, prefLabel or altLabel.
         */
        $scope.onDeleteClick = function() {
            $rootScope.$broadcast("removedConcept", {
                conceptID: ctrl.data,
                relation: ctrl.relation
            });
            $scope.conceptDialog.close();
        };

        /**
         * change the relation of a concept.
         * @param {string} relation - updated label-to-label relation
         */
        $scope.changeRelation = function(relation) {
            $rootScope.$broadcast("changedConcept", {
                concept: $scope.concept,
                oldRelation: ctrl.relation,
                newRelation: relation
            });
            $scope.conceptDialog.close();
            ctrl.relation = relation;  // update button
        };
    }]
});
