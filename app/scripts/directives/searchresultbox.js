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
            '<div class="box bigbox label">',
    		  '<span class="thumbnail">Linienbandkeramik (Neolithic culture and style)</span>',
    		  '<span class="note">This is a note.</span>',
    		  '<span class="type"><span class="icon-label"></span></span>',
    		  '<span class="language">en</span>',
    		'</div>'
        ].join(""),
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            //element.text('this is the searchResultBox directive');
        }
    };
  });
