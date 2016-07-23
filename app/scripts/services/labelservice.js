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
    });

  });
