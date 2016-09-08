'use strict';

/**
 * @ngdoc service
 * @name labelsApp.ResourcesService
 * @description
 * # ResourcesService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('ResourcesService', function ($http, ConfigService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.get = function(url, success, failure) {

        $http.get(ConfigService.host + "/resourceinfo?uri=" + encodeURI(url)).then(function(response) {
            // success
            success(response.data);
        }, function(response) {
            // failure
            failure(response.data.error.message);
        });

    };

});
