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
      template:
        '<div class="box small getty">',
            '<span class="relation"></span>',
            '<span class="thumbnail">Linienbandkeramik (Neolithic culture and style)</span>',
            '<span class="type">(Getty)</span>',
            '<span class="language">en</span>',
        '</div>'
        .join(""),




      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the smallBox directive');
      }
    };
  });
