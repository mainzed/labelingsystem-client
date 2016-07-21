'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('labelsApp')
  .directive('breadcrumbs', function ($location) {
    return {
      template: [
          '<div>',

            // vocabulary
            '<span ng-show="showVocabulary">',
                '<a ng-show="!showVocabularies" href="#/admin/vocabularies">{{ user.name }}</a>',
                ' > ',
                '{{ vocabulary.title[0] }}',
            '</span>',

            // label detail
            '<span ng-show="showLabelDetail">',
                '<a ng-show="!showVocabularies" href="#/admin/vocabularies">{{ user.name }}</a>',
                ' > ',
                '<a href="#/admin/vocabularies/{{ vocabulary.id }}/labels">',
                    '{{ vocabulary.title[0] }}',
                '</a>',
                ' > ',
                '{{ label.prefLabel[0] }}',
            '</span>',

          '</div>'
      ].join(""),
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the breadcrumb directive');
        var path = $location.path();

        // check view and decide what breadcrumbs to show
        if (path.indexOf("/labels/") > -1) {
            scope.showLabelDetail = true;
        } else if (path.indexOf("/vocabularies/") > -1) {
            scope.showVocabulary = true;
        } else {
            scope.showVocabulary = false;
        }
      }
    };
  });
