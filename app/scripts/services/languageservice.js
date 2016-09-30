'use strict';

/**
 * @ngdoc service
 * @name labelsApp.VocabService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('LanguageService', function ($http, $q, ConfigService) {
    this.query = function() {
        var deferred = $q.defer();
        $http.get(ConfigService.host + '/languages').then(function(res) {
            deferred.resolve(res.data);
        }, function error(res) {
            deferred.reject(res);
        });
        return deferred.promise;
    };

});