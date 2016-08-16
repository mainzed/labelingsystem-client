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
            '<div class="box bigbox label">',  // label
    		  '<span class="thumbnail">{{ box.label }}</span>',
    		  '<span class="note">{{ box.description }}</span>',
    		  '<span class="type"><span class="icon-label"></span></span>',
    		  '<span class="language"></span>',
    		'</div>'
        ].join(""),
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            //element.text('this is the searchResultBox directive');
        }
    };
  });
