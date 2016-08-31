'use strict';

/**
 * @ngdoc service
 * @name labelsApp.retcatService
 * @description
 * # retcatService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('SearchService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var host = "http://143.93.114.135";

    this.search = function(thesaurus, text, success, failure) {
        $http.get(host + '/api/v1/resourcequery?retcat=' + thesaurus + '&query=' + text).then(function(res) {
            success(res.data);
        }, function(res) {
            failure(res);
        });
    };

  });
