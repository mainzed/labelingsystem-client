'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('smallBox', function (ngDialog) {
    return {
      template: [
        '<div class="box small {{ cssClass }} {{ quality }}" ng-click="onBoxClick()">',
            '<span class="relation" ng-bind-html="relation"></span>',
            '<span class="thumbnail" ng-bind="text"></span>',
            '<span class="type" ng-bind-html="type"></span>',
            '<span class="language" ng-bind="language"></span>',
        '</div>'
      ].join(""),
      restrict: 'E',
      //replace: true,
      scope: {
        ngModel: '='
      },
      link: function postLink(scope, element, attrs) {
        //console.log(scope.boxes);
        var boxes;

        // set boxes as soon as they are ready
        scope.$watchCollection('scope.boxes', function(newValue, oldValue) {
            //console.log("boxes changed!!!");
            //boxes = newValue;
            //console.log(newValue);
        });

        // add text
        scope.text = scope.ngModel.value;

        // add attribute, label or thesauri icon and css class
        // TODO: (ls) for labels outside of own vocab
        if (scope.ngModel.category === "attribute") {
            // attributes
            if (scope.ngModel.type === "prefLabel") {
                scope.type = "<span class='icon-preflabel'></span>";

            } else if (scope.ngModel.type === "altLabel") {
                scope.type = "<span class='icon-altlabel'></span>";
            } else if (scope.ngModel.type === "description") {
                scope.type = "<span class='icon-note'></span>";
            } else {
                console.log("unknown attribute type");
            }

            // css
            scope.cssClass = "text";

        } else if (scope.ngModel.type === "label") {
            // labels
            scope.type = "<span class='icon-label'></span>";
            scope.cssClass = "label";
        } else {
            // other thesauri
            scope.type = "(" + scope.ngModel.type + ")";
            scope.cssClass = scope.ngModel.type;
        }

        // add quality css
        scope.quality = scope.ngModel.quality;

        // add language
        scope.language = scope.ngModel.lang;

        // add relation icons
        if (scope.ngModel.category === "related" || scope.ngModel.category === "relatedMatch" || scope.ngModel.category === "seeAlso") {
            scope.relation = "<span class='icon-related'></span>";
        } else if (scope.ngModel.category === "exactMatch") {
            scope.relation = "<span class='icon-exact'></span>";
        } else if (scope.ngModel.category === "closeMatch") {
            scope.relation = "<span class='icon-close'></span>";
        } else {
            // narrower, broader etc. no icon
            scope.relation = "";
        }

        //console.log(scope.ngModel);
        //console.log();
        //scope.relation = "<span class='icon-exact'></span>";

        scope.onBoxClick = function() {
            ngDialog.open({
                template: 'views/dialogs/small-box-detail.html',
                disableAnimation: true,
                scope: scope
            });
        };

        scope.onDeleteClick = function() {

            console.log(scope.ngModel.type);

            console.log(scope.boxes);

        };

    }
  };
});
