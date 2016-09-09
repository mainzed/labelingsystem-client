'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:conceptBox
 * @description
 * # conceptBox
 */
angular.module('labelsApp')
  .directive('conceptBox', function ($location, ngDialog, LabelService, HelperService, $routeParams, AuthService) {
    return {
        templateUrl: "views/directives/concept-box.html",
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
                scope.thumbnail = HelperService.getThumbnail(concept);
            }, function(err) {
                console.log(err);
            });

            /**
             * Opens a dialog with detailed information.
             */
            scope.openDialog = function() {
                ngDialog.open({
                    template: "views/dialogs/small-box-concept.html",
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
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

                    // send updated label to server
                    var jsonObject = {
                        item: parentConcept,
                        user: AuthService.getUser().name
                    };
                    LabelService.update({id: $routeParams.lID}, jsonObject, function() {
                        // delete element from DOM
                        element.remove();

                    }, function(err) {
                        console.log(err);
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

                    // update parent concept
                    var jsonObject = {
                        item: parentConcept,
                        user: AuthService.getUser().name
                    };

                    LabelService.update({ id: $routeParams.lID }, jsonObject, function() {

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

                    }, function(res) {
                        console.log(res);
                    });

                });





            };


        }
    };
});
