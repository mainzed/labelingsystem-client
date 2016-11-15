"use strict";

angular.module("labelsApp")
.component("lsLabelBox", {
    bindings: {
        data: "=",  // concept id or resource
        relation: "@",  // "related", "broader", "narrower"
        parentConcept: "=",  // needed to push updates on relation changes (maybe not)
        mode: "@ "  // viewer
    },
    templateUrl: "scripts/components/concept-detail/label-box/label-box.html",
    controller: ["$scope", "$window", "$routeParams", "$location", "$rootScope", "ngDialog", "TooltipService", "ConceptService", "ResourcesService", "CachingService", "LanguageService", function($scope, $window, $routeParams, $location, $rootScope, ngDialog, TooltipService, ConceptService, ResourcesService, CachingService, LanguageService) {
        var ctrl = this;

        var scope = $scope;

        ctrl.isConcept = null;

        ctrl.$onInit = function() {
            ctrl.isConcept = !ctrl.data.uri;
            $scope.tooltips = TooltipService;
            if (ctrl.isConcept) {  // is same-vocab concept
                ConceptService.get({ id: ctrl.data }, function(concept) {
                    ctrl.concept = concept;
                    ctrl.getLanguages();

                    ctrl.refreshTemp(ctrl.concept);
                    concept.getDetails().then(function(conceptDetails) {
                        $scope.conceptDetails = conceptDetails;
                        $scope.$apply();
                    });
                });
                ctrl.relationCss = "icon-arrow";
            } else {
                ResourcesService.get({ uri: ctrl.data.uri }, function(resource) {
                    ctrl.concept = resource;
                    ctrl.getLanguages();
                });

                // determine relation icon
                if (ctrl.relation === "closeMatch") {
                    ctrl.relationCss = "icon-close";
                } else if (ctrl.relation === "exactMatch") {
                    ctrl.relationCss = "icon-exact";
                } else if (ctrl.relation === "relatedMatch") {
                    ctrl.relationCss = "icon-arrow";
                }
            }
            ctrl.newRelation = ctrl.relation;
            ctrl.cssType = ctrl.isConcept ? "label" : ctrl.data.type;
        };

        ctrl.getLanguages = function() {
            // get languages for language tooltips
            if (CachingService.languages.length) {
                ctrl.languages = CachingService.languages;
                ctrl.langTooltip = ctrl.getLangTooltip();
            } else {
                LanguageService.query().then(function(languages) {
                    ctrl.languages = languages;
                    CachingService.languages = languages;
                    ctrl.langTooltip = ctrl.getLangTooltip();
                })
            }
        };

        ctrl.getLangTooltip = function(resource) {
            var langObj = _.find(ctrl.languages, {value: ctrl.concept.lang});
            if (langObj && langObj.name) {
                return langObj.name;
            }
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
            if (ctrl.mode === "viewer" && ctrl.isConcept) {  // viewer concept
                var currentPath = $location.path().split("/");
                currentPath.pop();
                currentPath.push(ctrl.concept.id);
                $location.path(currentPath.join("/"));
            } else if (ctrl.mode === "viewer" && !ctrl.isConcept) {  // viewer resource
                ctrl.openResource();
            } else {
                ctrl.dialog = ngDialog.open({  // editor concept & resource
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
        ctrl.openConcept = function() {
            $location.path("/editor/vocabularies/" + ctrl.concept.vocabID + "/concepts/" + ctrl.concept.id);
        };

        /**
         * Open resource-url in new tab.
        */
        ctrl.openResource = function() {
            $window.open(ctrl.concept.uri, "_blank");
        };

        /**
         * Deletes the selected resource, description, prefLabel or altLabel.
         */
        $scope.onDeleteClick = function() {
            if (ctrl.isConcept) {
                $rootScope.$broadcast("removedConcept", {
                    conceptID: ctrl.concept.id,
                    relation: ctrl.relation
                });
            } else {
                $rootScope.$broadcast("removedResource", {
                    resourceURI: ctrl.concept.uri,
                    relation: ctrl.relation
                });
            }
            ctrl.dialog.close();
        };

        $scope.$on("ngDialog.closed", function(e, $dialog) {
            if (ctrl.dialog && ctrl.dialog.id === $dialog.attr("id")) {  // is the resource dialog
                if (ctrl.newRelation !== ctrl.relation) {
                    $rootScope.$broadcast("changedRelation", {
                        newRelation: ctrl.newRelation,
                        oldRelation: ctrl.relation,
                        resource: ctrl.concept
                    });
                }
            }
        });
    }]
});
