'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:conceptBox
 * @description
 * # conceptBox
 */
angular.module('labelsApp')
  .directive('lsLabelBox', function ($rootScope, $location, ngDialog, LabelService, HelperService, TooltipService) {
    return {
        templateUrl: "scripts/components/concept-detail/label-box/label-box.html",
        restrict: 'E',
        scope: {
            data: "=",  // concept ID
            relation: "@",  // "related", "broader", "narrower"
            parentConcept: "=",  // needed to push updates on relation changes (maybe not)
            mode: "@ "  // viewer
        },
        link: function postLink(scope, element) {

            scope.tooltips = TooltipService;

            // get concept data from ID
            LabelService.get({id: scope.data}, function(concept) {
                scope.concept = concept;
                //scope.selected = scope.selected || scope.relation;
                //$(".nano").nanoScroller();
            }, function(err) {
                console.log(err);
            });

            /**
             * Opens a dialog with detailed information.
             */
            scope.openDialog = function() {
                if (scope.mode === "viewer") {

                    var currentPath = $location.path().split("/");
                    currentPath.pop();
                    currentPath.push(scope.concept.id);
                    $location.path(currentPath.join("/"));

                } else {
                    scope.concept.getDetails().then(function(conceptDetails) {
                        scope.conceptDetails = conceptDetails;
                        scope.$apply();
                    });

                    scope.conceptDialog = ngDialog.open({
                        template: "scripts/components/concept-detail/label-box/dialog.html",
                        className: 'bigdialog',
                        showClose: false,
                        disableAnimation: true,
                        scope: scope
                    });
                }

            };

            /**
             * redirect to new concept path
             */
            scope.openConcept = function() {
                $location.path('/editor/vocabularies/' + scope.concept.vocabID + '/concepts/' + scope.concept.id);
            };

            /**
             * Deletes the selected resource, description, prefLabel or altLabel.
             */
            scope.onDeleteClick = function() {
                $rootScope.$broadcast("removedConcept", {
                    conceptID: scope.data,
                    relation: scope.relation
                });
                scope.conceptDialog.close();
            };

            /**
             * change the relation of a concept.
             * @param {string} relation - updated label-to-label relation
             */
            scope.changeRelation = function(relation) {
                $rootScope.$broadcast("changedConcept", {
                    concept: scope.concept,
                    oldRelation: scope.relation,
                    newRelation: relation
                });
                scope.conceptDialog.close();
                scope.relation = relation;  // update button
            };

            // add listener to init nanoScroller once the dialog is loaded
            scope.$on('ngDialog.opened', function (e, $dialog) {
                if (scope.conceptDialog && scope.conceptDialog.id === $dialog.attr('id')) {  // is the resource dialog
                    HelperService.refreshNanoScroller();
                }
            });
        }
    };
});
