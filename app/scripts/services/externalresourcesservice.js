'use strict';

/**
 * @ngdoc service
 * @name labelsApp.externalResourcesService
 * @description
 * # externalResourcesService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('ExternalResourcesService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.get = function(url, success, failure) {

        $http.get("http://labeling.i3mainz.hs-mainz.de/api/v1/resourcelabel?url=" + encodeURI(url)).then(function(response) {
            // success
            success(response.data);
        }, function(response) {
            // failure
            failure(response.data.error.message);
        });

    };

});
