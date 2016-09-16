'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:vocabBox
 * @description
 * # vocabBox
 */
angular.module('labelsApp')
  .directive('lsVocabBox', function ($location) {
    return {
        templateUrl: 'scripts/components/vocabs-overview/vocab-box/vocab-box.html',
        restrict: 'E',
        scope: {
            data: "="
        },
        link: function postLink(scope) {

            /**
             * Redirects to the label overview of the specified vocabulary.
             * @param {string} id - Vocabulary ID
             */
            scope.onClick = function(id) {
                $location.path('/admin/vocabularies/' + id + '/concepts');
            };

            /**
             * Get skos of vocabulary url
             * @param {string} id - Vocabulary ID
             * @return {string} url to download vocab in skos format
             */
            // $scope.getDownloadUrl = function(id) {
            //     return ConfigService.host + "/vocabs/" + id + ".skos";
            // };

        }
    };
});
