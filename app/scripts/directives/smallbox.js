'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('smallBox', function () {
    return {
      template: [
          '<div class="box small {{ cssClass }}">',
            '<span class="relation" ng-bind="relation"></span>',
            '<span class="thumbnail" ng-bind="text"></span>',
            '<span class="type" ng-bind-html="type"></span>',
            '<span class="language" ng-bind="language"></span>',
        '</div>'
      ].join(""),
      restrict: 'E',
      //replace: true,
      scope:{
        ngModel: '='
      },
      link: function postLink(scope, element, attrs) {
        //console.log(scope.ngModel);

        if (scope.ngModel.category === "attribute") {

            if (scope.ngModel.type === "prefLabel") {
                scope.cssClass = "label";
                scope.type = "<span class='icon-preflabel'></span>";  // icon
                scope.text = scope.ngModel.value;
                scope.language = scope.ngModel.lang;

            } else if (scope.ngModel.type === "altLabel") {
                scope.cssClass = "label";
                scope.type = "<span class='icon-altlabel'></span>";  // icon
                scope.text = scope.ngModel.value;
                scope.language = scope.ngModel.lang;

            } else if (scope.ngModel.type === "description") {
                scope.cssClass = "label";
                scope.type = "<span class='icon-note'></span>";  // icon
                scope.text = scope.ngModel.value;
                scope.language = scope.ngModel.lang;
            }
        } else {
            // all categories, but attribute
            if (scope.ngModel.type === "getty") {
                scope.cssClass = "getty";
                scope.type = "(Getty)";  // icon
                scope.text = scope.ngModel.value;
                scope.language = scope.ngModel.lang;
                scope.relation = scope.ngModel.category;

            } else if (scope.ngModel.type === "eh") {
                scope.cssClass = "eh";
                scope.type = "(HE)";  // icon
                scope.text = scope.ngModel.value;
                scope.language = scope.ngModel.lang;
                scope.relation = scope.ngModel.category;

            } else if (scope.ngModel.type === "label") {
                scope.cssClass = "label";
                scope.type = "<span class='icon-label'></span>";  // icon
                scope.text = scope.ngModel.value;
                scope.language = scope.ngModel.lang;
                scope.relation = scope.ngModel.category;

            } else if (scope.ngModel.type === "dbpedia") {
                scope.cssClass = "dbpedia";
                scope.type = "(dbpedia)";  // icon
                scope.text = scope.ngModel.value;
                scope.language = scope.ngModel.lang;
                scope.relation = scope.ngModel.category;
            } else {
                scope.cssClass = "dbpedia";
                scope.type = scope.ngModel.type;  // icon
                scope.text = scope.ngModel.value;
                scope.language = scope.ngModel.lang;
                scope.relation = scope.ngModel.category;
            }

            // remove category if broader or narrower
            if (scope.relation === "broader" || scope.relation === "broadMatch" || scope.relation === "narrowMatch" || scope.relation === "narrower") {
                scope.relation = "";
            }
        }

    }
  };
});
