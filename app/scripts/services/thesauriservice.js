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
    // AngularJS will instantiate a singleton by calling "new" on this function
    var host = "http://143.93.114.135";

    return $resource(host + '/api/v1/retcat/vocabulary/:id');

  });
