'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('smallBox', function (ngDialog, $routeParams, $rootScope, LabelService, TooltipService) {
    return {
      templateUrl: "views/directives/small-box.html",
      restrict: 'E',
      //replace: true,
    //   scope: {
    //     ngModel: '='
    //   },
      link: function postLink(scope, element, attrs) {

        scope.ngModel = scope.box;

        scope.tooltip = TooltipService.icons.types[scope.ngModel.type];

        var boxes;

        var resource = scope.ngModel.resource;
        var relation = scope.ngModel.relation;
        var boxType = scope.ngModel.boxType;
        //console.log(scope.ngModel);

        // determine text
        if (resource.label) {
            scope.text = resource.label;
        } else {
            scope.text = resource.value;
        }

        // determine css
        if (relation === "attribute") {
            scope.cssClass = "text";
        } else if (boxType === "label") {
            scope.cssClass = boxType + " " + "high";
        } else {
            scope.cssClass = boxType + " " + resource.quality;
        }
        //console.log(scope.cssClass);

        // determine type icon
        if (boxType === "description") {
            scope.type = "<span class='icon-note'></span>";
        } else if (boxType === "prefLabel") {
            scope.type = "<span class='icon-preflabel'></span>";
        } else if (boxType === "altLabel") {
            scope.type = "<span class='icon-altlabel'></span>";
        } else if (boxType === "label") {
            scope.type = "<span class='icon-label'></span>";
        } else if (boxType === "wayback") {
            scope.type = "(" + boxType + ")";
        } else {
            scope.type = "(" + resource.type + ")";
        }

        // determine relation icon
        if (relation === "exactMatch") {
            scope.relation = "<span class='icon-exact'></span>";

        } else if (relation === "closeMatch") {
            scope.relation = "<span class='icon-close'></span>";

        } else if (relation === "relatedMatch" || relation === "seeAlso" || relation === "related") {
            scope.relation = "<span class='icon-related'></span>";

        }

        // determine language
        scope.language = resource.lang;

        scope.onBoxClick = function() {
            //console.log(boxType);
            if (boxType === "label") {
                scope.categories = [
                    "broader",
                    "related",
                    "narrower"
                ];
            } else if (boxType === "wayback") {
                scope.categories = ["seeAlso"];
            } else if (boxType === "prefLabel" || boxType === "altlabel" || boxType === "description") {
                scope.categories = [];
            } else {
                scope.categories = [
                    "broadMatch",
                    "exactMatch",
                    "relatedMatch",
                    "closeMatch",
                    "narrowMatch"
                ];
            }
            ngDialog.open({
                template: 'views/dialogs/small-box-detail.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: scope
            });
        };

        scope.onDeleteClick = function() {

            var updatedlabel;

            // get current label
            LabelService.get({id: $routeParams.lID}, function(label) {

                updatedlabel = label;

                if (boxType === "description") {
                    delete updatedlabel.scopeNote;

                } else {
                    var removeArray;
                    if (boxType === "prefLabel") {
                        removeArray = "prefLabels"
                    } else if (boxType === "altLabel") {
                        removeArray = "altLabels"
                    } else if (boxType === "description") {
                        removeArray = "scopeNote"
                    } else {
                        removeArray = relation;
                    }

                    // Find item index using indexOf+find
                    var index = _.indexOf(updatedlabel[removeArray], _.find(updatedlabel[removeArray], resource));
                    updatedlabel[removeArray].splice(index, 1);
                }

                // send updated label to server
                var jsonObject = {
                    item: updatedlabel,
                    user: "demo"
                };

                LabelService.update({id: $routeParams.lID}, jsonObject, function(res) {
                    // when successfull, remove current box
                    var index = _.indexOf(scope.boxes, _.find(scope.boxes, scope.box));
                    scope.boxes.splice(index, 1);
                }, function(res) {
                    console.log(res);
                });



            });

        };



        // reload nanoscroller when directive rendered
        $(".nano").nanoScroller();
    }
  };
});
