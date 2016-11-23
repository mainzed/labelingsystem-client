"use strict";

/**
 * @ngdoc service
 * @name labelsApp.ResourcesService
 * @description
 * # ResourcesService
 * Service in the labelsApp.
 */
angular.module("labelsApp")
.service("ResourcesService", function($resource, ConfigService) {
    var Resource = $resource(ConfigService.api + "/resourceinfo", null, {
        "get": {
            method: "GET",
            // params: { uri: true },
            isArray: false
        }
    });

    Resource.prototype.getLabel = function() {
        return this.label;
    };

    Resource.prototype.hasBroader = function() {
        return this.broaderTerms.length > 0;
    };

    Resource.prototype.hasNarrower = function() {
        return this.narrowerTerms.length > 0;
    };

    Resource.prototype.hasMore = function() {
        return _.has(this, "description") || this.hasBroader() || this.hasNarrower();
    };

    return Resource;
});
