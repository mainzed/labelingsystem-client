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
        scope: {
            data: "=",  // data attribute available as scope.data (two-way-binding)
            vocabulary: "=vocab",
            label: "=",  // need label to append new data to
            boxes: "=",  // need to append new box and prevent reloading all boxes
            action: "&"  // get action to refresh boxes
        },
        link: function postLink(scope, element, attrs) {
            //scope.showMore = false;

            scope.type = scope.data.type;

            //scope.labelLimit = 25;

            if (scope.data.type === "ls" && scope.data.scheme === scope.vocabulary.title.value) {  // ls same vocab
                scope.icon = "<span class='icon-label'></span>";
                scope.type = "label";

            } else if (scope.data.type === "ls" && scope.data.scheme !== scope.vocabulary.title.value) {  // ls other vocabs
                scope.icon = "(" + scope.data.type + ")";
            } else {
                scope.icon = "(" + scope.data.type + ")";
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

                if (!scope.label[relation]) {
                    scope.label[relation] = [];
                }

                if (relation === "broader" || relation === "related" || relation === "narrower") {  // same vocab
                    // just push label-id to array
                    var labelID = scope.data.uri.split("/").pop();
                    scope.label[relation].push(labelID);

                } else {
                    scope.label[relation].push({
                        type: scope.data.type,
                        url: scope.data.uri
                    });
                }

                // refesh boxes via controller function
                scope.action();

                // var putObject = {
                //     "item": scope.label,
                //     "user": "fakeUser"
                // };
                // LabelService.update(scope.label.id, putObject, function(res) {
                //     // success
                //     console.log(res);
                // }, function(res) {
                //     console.log("error");
                //     console.log(res);
                // });
                // send changed label to server, get result for just this one change and update just one box

            };

            // reload nanoscroller when directive rendered
            $(".nano").nanoScroller();
        }
    };
  });
