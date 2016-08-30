'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module('labelsApp')
  .directive('searchResultBox', function (ngDialog, LabelService) {
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
            }

            /**
             * opens a type-specific dialog
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

            scope.onAddClick = function(relation) {
                // TODO: check everywhere if resource is already linked to this label somehow
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

                //console.log(updatedLabel);
                var updateObject = {
                    item: updatedLabel,
                    user: "demo"
                };

                LabelService.update({id: updatedLabel.id}, updateObject, function(res) {
                    // success
                    //scope.label = updatedLabel;

                }, function(res) {
                    console.log(res);
                });
            };

            // reload nanoscroller when directive rendered
            $(".nano").nanoScroller();
        }
    };
  });
