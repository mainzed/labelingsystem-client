'use strict';

/**
 * @ngdoc service
 * @name labelsApp.VocabService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('VocabService', function ($resource, AuthService, ConfigService) {

    return $resource(ConfigService.host + '/vocabs/:id', null, {
        'query': { method: 'GET', params: { draft: true }, isArray: true },
        'getPublicOnly': { method: 'GET', isArray: true },
        'update': { method:'PUT' },
        'download' : { method: 'GET', url: ConfigService.host + '/vocabs/:id' + ".skos", isArray: false },
        'remove': { method: 'DELETE', params: { user: "demo", type: "delete" }}
    });

  });
