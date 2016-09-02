'use strict';

/**
 * @ngdoc service
 * @name labelsApp.ResourcesService
 * @description
 * # ResourcesService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('ResourcesService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.get = function(url, success, failure) {
        var host = "http://143.93.114.135";

        $http.get(host + "/api/v1/resourceinfo?url=" + encodeURI(url)).then(function(response) {
            // success
            success(response.data);
        }, function(response) {
            // failure
            failure(response.data.error.message);
        });

    };

});
