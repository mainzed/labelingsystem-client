'use strict';

/**
 * @ngdoc service
 * @name labelsApp.waybackService
 * @description
 * # waybackService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('WaybackService', function ($http) {

    var host = "http://143.93.114.135/api/v1";

    this.get = function(url, success, failure) {
        $http.get(host + '/resourcewayback?url=' + url).then(function(res) {
            // return wayback link
            success(res.data.uri);
        }, function(err) {
            failure(err);
        });
    };

  });
