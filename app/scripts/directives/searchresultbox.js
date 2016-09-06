'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module('labelsApp')
  .directive('searchResultBox', function (ngDialog, LabelService, ResourcesService) {
    return {
        templateUrl: "views/directives/search-result-box.html",
        restrict: 'E',

        link: function postLink(scope, element, attrs) {

            scope.isSameVocab = function() {
                return scope.data.type === 'ls' && scope.data.scheme === scope.vocabulary.title.value;
            };

            scope.data = scope.box;


            if (scope.isSameVocab()) {
                scope.data.type = "label";
                console.log(scope.data);
            }

            /**
             * Opens a type-specific dialog that shows the connection (relation)
             * options for each type to link to the label.
             */
            scope.onClick = function() {
                ngDialog.open({
                    template: 'views/dialogs/add-resource.html',
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });
            };

            /**
             * Link a search result to the current label by added the resource's
             * information to the according relation-array of the label.
             * @param {string} relation - Label-to-Resource relation  (e.g. "broader" or "exactMatch")
             */
            scope.onAddClick = function(relation) {
                var updatedLabel = scope.label;

                if (!updatedLabel[relation]) {
                    updatedLabel[relation] = [];
                }

                if (relation === "broader" || relation === "related" || relation === "narrower") {  // same vocab
                    // just push label-id to array
                    var labelID = scope.data.uri.split("/").pop();
                    updatedLabel[relation].push(labelID);

                } else {
                    updatedLabel[relation].push({
                        type: scope.data.type,
                        url: scope.data.uri
                    });
                }

                var updateObject = {
                    item: updatedLabel,
                    user: "demo"
                };

                LabelService.update({id: updatedLabel.id}, updateObject, function() {
                    // get all infos and add box temporarily
                    ResourcesService.get(scope.data.uri, function(resource) {

                        // success
                        scope.boxes.push({
                            relation: relation,
                            boxType: scope.data.type,
                            resource: resource
                        });

                    }, function(err) {
                        console.log(err);
                    });
                }, function(err) {
                    console.log(err);
                });
            };

            /**
             * Watcher that updates nanoscroller when box is extended.
             */
            scope.$watch("showMore", function() {
                console.log("showMore changed!");
            });

            // reload nanoscroller when directive rendered
            $(".nano").nanoScroller();
        }
    };
  });
