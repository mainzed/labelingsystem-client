'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('labelsApp')
  .directive('breadcrumbs', function ($location, $routeParams) {
    return {
      template: [
          '<div id="breadcrumb">',

            // vocabulary
            '<span ng-show="showVocabulary">',
                '<a ng-show="!showVocabularies" href="#/admin/vocabularies">{{ user.name }}</a>',
                '<span class="icon-arrow"></span>',
                '{{ vocabulary.title.value }}',
            '</span>',

            // label detail
            '<span ng-show="showLabelDetail">',
                '<a ng-show="!showVocabularies" href="#/admin/vocabularies">{{ user.name }}</a>',
                '<span class="icon-arrow"></span>',
                '<a href="#/admin/vocabularies/{{ vocabulary.id }}/labels">',
                    '{{ vocabulary.title.value }}',
                '</a>',
                '<span class="icon-arrow"></span>',
            '</span>',
          '</div>',
          '<h1 ng-repeat="prefLabel in label.prefLabels" ng-show="prefLabel.isThumbnail">',
            '{{ prefLabel.value }}',
          '</h1>'
      ].join(""),
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the breadcrumb directive');
        var path = $location.path();

        // get label from url
        // var labelID = $routeParams.lID
        // console.log(scope.label);
        // for (var i = 0; i < scope.label.prefLabels.length; i++) {
        //     var label = scope.label.prefLabels[i];
        //     if (label.isThumbnail) {
        //         scope.prefLabel = label;
        //     }
        // }

        // check view and decide what breadcrumbs to show
        if (path.indexOf("/labels/") > -1) {
            scope.showLabelDetail = true;
            //console.log(scope.label);
            // get label by id


        } else if (path.indexOf("/vocabularies/") > -1) {
            scope.showVocabulary = true;

        } else {
            scope.showVocabulary = false;
        }
      }
    };
  });
