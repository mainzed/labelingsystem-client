'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module('labelsApp')
  .directive('searchResultBox', function () {
    return {
        template: [
            '<div class="box bigbox {{ box.type }}">',  // label
    		  '<span class="thumbnail">{{ box.label }}</span>',
    		  '<span class="note">{{ box.description }}</span>',
    		  '<span class="type">(ls)</span>',
    		  '<span class="language">{{ box.lang.split("-")[0] }}</span>',
    		'</div>'
        ].join(""),
        restrict: 'E',
        link: function postLink(scope, element, attrs) {

            // set icon
            if (scope.box.type === "ls" ) {
                scope.icon = "<span class='icon-label'></span>"
                console.log("yes");
            }
        }
    };
  });
