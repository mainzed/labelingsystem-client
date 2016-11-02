'use strict';

/**
 * @ngdoc service
 * @name labelsApp.waybackService
 * @description
 * # waybackService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('WaybackService', function ($http, ConfigService) {

    this.get = function(url, success, failure) {
        $http.get(ConfigService.api + '/resourcewayback?url=' + url).then(function(res) {
            // return wayback link
            success(res.data.uri);
        }, function(err) {
            failure(err);
        });
    };

  });
