'use strict';

/**
 * @ngdoc service
 * @name labelsApp.VocabService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('VocabService', function ($resource, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return $resource('http://143.93.114.135/api/v1/vocabs/:id', null, {
        'save': {
            method: 'POST',
            url: "http://143.93.114.135/api/v1/vocabs/user/demo"
        },
        'update': { method:'PUT' }
    });

  });
