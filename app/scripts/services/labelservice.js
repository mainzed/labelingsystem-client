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
    var host = "http://143.93.114.135";

    return $resource(host + '/api/v1/labels/:id', null, {
        'save': {
            method: 'POST',
            url: host + '/api/v1/labels/user/demo'
        },
        'update': {
            method: 'PUT',
            url: host + '/api/v1/labels/:id/user/demo/type/somechange'
        }

        //'getByVocabID': {method: 'GET', params: {vocabs: "7e34e500-53e8-48a3-b20c-aa6c8faee743"}, isArray:true}
    });

  });
