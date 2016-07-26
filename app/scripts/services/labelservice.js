'use strict';

/**
 * @ngdoc service
 * @name labelsApp.LabelService
 * @description
 * # LabelService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('LabelService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return $resource('http://labeling.i3mainz.hs-mainz.de/api/v1/labels/:id', null, {
        'update': { method:'PUT' }
        //'getByVocabID': {method: 'GET', params: {vocabs: "7e34e500-53e8-48a3-b20c-aa6c8faee743"}, isArray:true}
    });

  });
