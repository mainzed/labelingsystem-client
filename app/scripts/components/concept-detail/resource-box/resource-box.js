'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:resourceBox
* @description
* # resourceBox
*/
angular.module('labelsApp')
.directive('lsResourceBox', function ($rootScope, $timeout, $window, ngDialog, LabelService, $routeParams, ResourcesService) {
  return {
        templateUrl: "scripts/components/concept-detail/resource-box/resource-box.html",
        restrict: 'E',
        scope: {
            data: "=",  // concept ID
            relation: "@",  // "related", "broader", "narrower"
            mode: "@"
        },
        link: function postLink(scope, element) {

            // temporary
            scope.resource = {
                label: "...",
                type: scope.data.type
            };

            // get resource data from uri
            ResourcesService.get(scope.data.uri, function(resource) {
                scope.resource = resource;
            });

            // determine relation icon
            if (scope.relation === "closeMatch") {
                scope.relationIcon = "<span class='icon-close'></span>";
            } else if (scope.relation === "exactMatch") {
                scope.relationIcon = "<span title='exact Match' class='icon-exact'></span>";
            } else if (scope.relation === "relatedMatch") {
                scope.relationIcon = "<span class='icon-arrow'></span>";
            }

            /**
             * Opens a dialog with detailed information.
             */
            scope.openDialog = function() {
                //console.log(scope.mode);
                if (scope.mode === "viewer") {
                    $window.open(scope.data.uri, "_blank");

                } else {
                    var resourceDialog = ngDialog.open({
                        template: "scripts/components/concept-detail/resource-box/dialog.html",
                        className: 'bigdialog',
                        showClose: false,
                        closeByDocument: false,
                        disableAnimation: true,
                        scope: scope
                    });

                    // add listener to init nanoScroller once the dialog is loaded
                    $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                        if (resourceDialog.id === $dialog.attr('id')) {  // is the resource dialog
                            $timeout(function() {
                                $(".nano").nanoScroller();
                            }, 0);
                        }
                    });
                }

            };

            /**
             * Deletes the selected resource, description, prefLabel or altLabel.
            */
            scope.onDeleteClick = function() {

                // get current parent concept
                LabelService.get({id: $routeParams.lID}, function(concept) {
                    _.remove(concept[scope.relation], { "uri": scope.resource.uri });

                    LabelService.update({id: $routeParams.lID}, concept, function() {
                        // delete element from DOM
                        //element.remove();
                        $rootScope.$broadcast("removedResource", {
                            resourceURI: scope.resource.uri,
                            relation: scope.relation
                        });

                    }, function(err) {
                        console.log(err);
                    });
                });
            };

            /**
              * change the relation of a resource.
              * @param {string} newRelation - updated label-to-resource relation
              * @param {string} oldRelation - original label-to-resource relation
             */
             scope.changeRelation = function(newRelation, oldRelation) {

                LabelService.get({id: $routeParams.lID}, function(parentConcept) {

                    // get resource
                    var query = { uri: scope.resource.uri };
                    var resource = _.find(parentConcept[oldRelation], query);

                    // remove it from the array (e.g. remove a narrowMatch from the narrowWatch array)
                    _.remove(parentConcept[oldRelation], query);

                    // push resource to the corresponding array (e.g. to the broaderMatch array)
                    if (!parentConcept[newRelation]) {
                        parentConcept[newRelation] = [];
                    }
                    parentConcept[newRelation].push({
                        type: resource.type,
                        uri: resource.uri
                    });

                    parentConcept.save(function() {
                        // temporarily push changes to parentConcept without refreshing everything
                        // TODO: find cleaner solution
                        _.remove(scope.$parent.label[oldRelation], query);
                        if (!scope.$parent.label[newRelation]) {
                            scope.$parent.label[newRelation] = [];
                        }
                        scope.$parent.label[newRelation].push({
                            type: resource.type,
                            uri: resource.uri
                        });

                        // remove from current relation, gets created automatically in new column
                        element.remove();
                    });

                }, function(err) {
                    console.log(err);
                });
            };

            /**
             * Open resource-url in new tab.
            */
            scope.openResource = function() {
                $window.open(scope.resource.uri, "_blank");
            };
        }
    };
});
