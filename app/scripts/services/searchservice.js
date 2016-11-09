'use strict';

/**
 * @ngdoc service
 * @name labelsApp.SearchService
 * @description
 * Service in the labelsApp. Uses the LS Server API to get concepts from external
 * repositories. The available repositories are defined by the RetcatService.
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
