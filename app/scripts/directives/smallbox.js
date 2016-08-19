'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('smallBox', function (ngDialog, TooltipService) {
    return {
      templateUrl: "views/directives/small-box.html",
      restrict: 'E',
      //replace: true,
      scope: {
        ngModel: '='
      },
      link: function postLink(scope, element, attrs) {

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
            if (boxType === "label") {
                scope.categories = [
                    "broader",
                    "related",
                    "narrower"
                ];
            } else if (boxType === "wayback") {
                scope.categories = ["seeAlso"];
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
                disableAnimation: true,
                scope: scope
            });
        };

        scope.onDeleteClick = function() {

            console.log(scope.ngModel);

            console.log(scope.boxes);

        };



        // reload nanoscroller when directive rendered
        $(".nano").nanoScroller();
    }
  };
});
