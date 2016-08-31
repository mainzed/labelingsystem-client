'use strict';

/**
 * @ngdoc service
 * @name labelsApp.VocabService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('VocabService', function ($resource, AuthService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return $resource('http://143.93.114.135/api/v1/vocabs/:id', null, {
        'query': { method: 'GET', params: { draft: true }, isArray: true },
        'getPublicOnly': { method: 'GET', isArray: true },
        'update': { method:'PUT' },
        'remove': { method: 'DELETE', params: { user: AuthService.getUser().name, type: "delete" }},
        'deprecated': { method: 'DELETE', params: { user: AuthService.getUser().name, type: "deprecated" }}
    });

  });
