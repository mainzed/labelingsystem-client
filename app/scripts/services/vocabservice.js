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
        'remove': { method: 'DELETE', params: { user: AuthService.getUser().name, type: "delete" }},
        'deprecated': { method: 'DELETE', params: { user: AuthService.getUser().name, type: "deprecated" }}
    });

  });
