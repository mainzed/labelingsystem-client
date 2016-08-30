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
        'update': {
            method: 'PUT'
        }
    });

  });
