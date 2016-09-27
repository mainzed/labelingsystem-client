'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:conceptBox
 * @description
 * # conceptBox
 */
angular.module('labelsApp')
  .directive('lsLabelBox', function ($rootScope, $location, $timeout, ngDialog, LabelService, HelperService, $routeParams, AuthService, ConfigService) {
    return {
        templateUrl: "scripts/components/concept-detail/label-box/label-box.html",
        restrict: 'E',
        scope: {
            data: "=",  // concept ID
            relation: "@",  // "related", "broader", "narrower"
            parentConcept: "="  // needed to push updates on relation changes (maybe not)
        },
        link: function postLink(scope, element) {
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
                // get this concept's broader concepts
                scope.broaderConcepts = [];
                scope.narrowerConcepts = [];

                HelperService.getRelatedConcepts(scope.concept, "broader", function(broaderConcepts) {
                    scope.broaderConcepts = scope.broaderConcepts.concat(broaderConcepts);
                });
                HelperService.getRelatedConcepts(scope.concept, "narrower", function(narrowerConcepts) {
                    scope.narrowerConcepts = scope.narrowerConcepts.concat(narrowerConcepts);
                });

                if (ConfigService.showMatches) {
                    HelperService.getRelatedConcepts(scope.concept, "broadMatch", function(broaderConcepts) {
                        scope.broaderConcepts = scope.broaderConcepts.concat(broaderConcepts);
                    });
                    HelperService.getRelatedConcepts(scope.concept, "narrowMatch", function(narrowMatch) {
                        scope.narrowerConcepts = scope.narrowerConcepts.concat(narrowMatch);
                    });
                }


                // scope.broaderConcepts = [];
                // HelperService.getRelatedConcepts(scope.concept, "broader", function(broaderConcepts) {
                //     scope.broaderConcepts = scope.broaderConcepts.concat(broaderConcepts);
                // });
                // HelperService.getRelatedConcepts(scope.concept, "broadMatch", function(broaderResources) {
                //     scope.broaderConcepts = scope.broaderConcepts.concat(broaderResources);
                // });

                var conceptDialog = ngDialog.open({
                    template: "scripts/components/concept-detail/label-box/dialog.html",
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });

                // add listener to init nanoScroller once the dialog is loaded
                $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                    if (conceptDialog.id === $dialog.attr('id')) {  // is the resource dialog
                        $timeout(function() {
                            $(".nano").nanoScroller();
                        }, 0);
                    }
                });
            };

            /**
             * redirect to new concept path
             */
            scope.openConcept = function() {
                $location.path('/admin/vocabularies/' + scope.concept.vocabID + '/concepts/' + scope.concept.id);
            };

            /**
             * Deletes the selected resource, description, prefLabel or altLabel.
             */
            scope.onDeleteClick = function() {

                // get current parent concept
                LabelService.get({id: $routeParams.lID}, function(parentConcept) {

                    // remove current concept ID from array of relation in parentConcept
                    parentConcept[scope.relation] = _.pull(parentConcept[scope.relation], scope.concept.id);

                    // save to server
                    parentConcept.save(function() {
                        // delete element from DOM
                        element.remove();
                    }, function error(res) {
                        console.log(res);
                    });
                });
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
