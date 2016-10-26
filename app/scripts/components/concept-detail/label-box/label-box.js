'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:conceptBox
 * @description
 * # conceptBox
 */
angular.module('labelsApp')
  .directive('lsLabelBox', function ($rootScope, $location, $timeout, ngDialog, LabelService, HelperService, $routeParams, AuthService, ConfigService, TooltipService) {
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
                        closeByDocument: false,
                        disableAnimation: true,
                        scope: scope
                    });

                    // add listener to init nanoScroller once the dialog is loaded
                    $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                        if (scope.conceptDialog.id === $dialog.attr('id')) {  // is the resource dialog
                            $timeout(function() {
                                $(".nano").nanoScroller();
                            }, 0);
                        }
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
             * @param {string} newRelation - updated label-to-label relation
             * @param {string} oldRelation - original label-to-label relation
             */
            scope.changeRelation = function(newRelation, oldRelation) {

                // get current parent concept
                LabelService.get({id: $routeParams.lID}, function(parentConcept) {

                    // remove id from old relation array
                    _.remove(parentConcept[oldRelation], function(n) {
                        return n === scope.concept.id;
                    });

                    // add concept ID to new relation array
                    if (!parentConcept[newRelation]) {
                        parentConcept[newRelation] = [];
                    }
                    parentConcept[newRelation].push(scope.concept.id);

                    parentConcept.save(function() {
                        // temporarily push changes to parentConcept without refreshing everything
                        // TODO: find cleaner solution
                        _.remove(scope.$parent.label[oldRelation], function(n) {
                            return n === scope.concept.id;
                        });
                        if (!scope.$parent.label[newRelation]) {
                            scope.$parent.label[newRelation] = [];
                        }
                        scope.$parent.label[newRelation].push(scope.concept.id);

                        // remove from current relation, gets created automatically in new column
                        element.remove();

                    }, function error(res) {
                        console.log(res);
                    });

                });
            };

        }
    };
});
