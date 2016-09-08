'use strict';

/**
 * @ngdoc service
 * @name labelsApp.LabelService
 * @description
 * # LabelService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('LabelService', function ($resource, AuthService, ConfigService) {

    return $resource(ConfigService.host + '/labels/:id', null, {
        'update': {
            method: 'PUT'
        },
        'remove': {
            method: 'DELETE',
            params: {
                user: AuthService.getUser().name,
                type: "delete"
            }
        }
    });

  });
