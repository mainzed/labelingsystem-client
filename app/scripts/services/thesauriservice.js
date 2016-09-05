'use strict';

/**
 * @ngdoc service
 * @name labelsApp.thesauriService
 * @description
 * # thesauriService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('ThesauriService', function ($resource) {

    var host = "http://143.93.114.135/api/v1";

    return $resource(host + '/retcat/vocabulary/:id', null, {
        'query': {
            method: 'GET',
            url: host + '/retcat',
            isArray: true
        },
        'get': { isArray: true },
        'update': {
            method:'PUT',
            isArray: true
        }
    });
});
