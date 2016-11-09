'use strict';

/**
 * @ngdoc service
 * @name labelsApp.LicenseService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('LicenseService', function ($resource, ConfigService) {
    return $resource(ConfigService.api + '/licenses');
});
