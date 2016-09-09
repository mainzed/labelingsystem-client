'use strict';

/**
* @ngdoc directive
* @name labelsApp.directive:resourceBox
* @description
* # resourceBox
*/
angular.module('labelsApp')
.directive('resourceBox', function ($location, $timeout, $window, ngDialog, LabelService, HelperService, $routeParams, AuthService, ResourcesService) {
  return {
        templateUrl: "views/directives/resource-box.html",
        restrict: 'E',
        scope: {
            data: "=",  // concept ID
            relation: "@"  // "related", "broader", "narrower"
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
                //console.log(scope.relation);
                $(".nano").nanoScroller();  // not working currently
            });

            // determine relation icon
            if (scope.relation === "closeMatch") {
                scope.relationIcon = "<span class='icon-close'></span>";
            } else if (scope.relation === "exactMatch") {
                scope.relationIcon = "<span class='icon-exact'></span>";
            } else if (scope.relation === "relatedMatch") {
                scope.relationIcon = "<span class='icon-related'></span>";
            }

            /**
             * Opens a dialog with detailed information.
             */
            scope.openDialog = function() {
                ngDialog.open({
                    template: "views/dialogs/small-box-resource.html",
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });
            };

            /**
             * Deletes the selected resource, description, prefLabel or altLabel.
            */
            scope.onDeleteClick = function() {

                // get current parent concept
                LabelService.get({id: $routeParams.lID}, function(parentConcept) {
                    _.remove(parentConcept[scope.relation], { "uri": scope.resource.uri });

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

                    var jsonObject = {
                        item: parentConcept,
                        user: AuthService.getUser().name
                    };

                    LabelService.update({ id: $routeParams.lID }, jsonObject, function() {
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


                    }, function(res) {
                        console.log(res);
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

            // scope.$watchCollection("resource", function() {
            //     console.log("changed");
            //     // refresh nanoscroller
            //     $timeout(function() {
            //         $(".nano").nanoScroller();
            //     }, 0);
            //
            // });

        }
    };
});
