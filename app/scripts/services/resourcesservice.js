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

    var Resource = function(data) {
        this.description = data.description;
        this.group = data.group;;
        this.label = data.label;
        this.lang = data.lang;
        this.broaderTerms = data.broaderTerms;
        this.narrowerTerms = data.narrowerTerms;
        this.quality = data.quality;
        this.scheme = data.scheme;
        this.type = data.type;
        this.uri = data.uri;
    };

    Resource.prototype.hasBroader = function() {
        return this.broaderTerms.length > 0;
    };

    Resource.prototype.hasNarrower = function() {
        return this.narrowerTerms.length > 0;
    };

    Resource.prototype.hasMore = function() {
        return this.description || this.hasBroader() || this.hasNarrower();
    }

    this.get = function(url, success, failure) {
        $http.get(ConfigService.api + "/resourceinfo?uri=" + encodeURI(url)).then(function(response) {
            success(new Resource(response.data));
        }, function(response) {
            failure(response);
        });
    };

});
