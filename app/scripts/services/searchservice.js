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

    var SearchResult = $resource(ConfigService.api + '/resourcequery');

    SearchResult.prototype.hasBroader = function() {
        return this.broaderTerms.length > 0;
    };

    SearchResult.prototype.hasNarrower = function() {
        return this.narrowerTerms.length > 0;
    };

    SearchResult.prototype.hasMore = function() {
        return this.description || this.hasBroader() || this.hasNarrower();
    }
    return SearchResult;
});
