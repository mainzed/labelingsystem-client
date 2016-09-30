'use strict';

/**
 * @ngdoc service
 * @name labelsApp.retcatService
 * @description
 * # retcatService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('SearchService', function ($resource, ConfigService) {

    var SearchResult = $resource(ConfigService.host + '/resourcequery');



    // this.search = function(thesaurus, text, success, failure) {
    //     $http.get(ConfigService.host + '/resourcequery?retcat=' + thesaurus + '&query=' + text).then(function(res) {
    //         success(res.data);
    //     }, function(res) {
    //         failure(res);
    //     });
    // };

    return SearchResult;

  });
