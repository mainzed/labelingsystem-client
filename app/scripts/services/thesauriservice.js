'use strict';

/**
 * @ngdoc service
 * @name labelsApp.thesauriService
 * @description
 * # thesauriService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('ThesauriService', function ($resource, ConfigService) {

    return $resource(ConfigService.host + '/retcat/vocabulary/:id', null, {
        'query': {
            method: 'GET',
            url: ConfigService.host + '/retcat',
            isArray: true
        },
        'get': { isArray: true },
        'update': {
            method: 'PUT',
            isArray: true
        }
    });
});
