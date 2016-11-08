'use strict';

/**
 * @ngdoc service
 * @name labelsApp.ConceptService
 * @description
 * # ConceptService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('AgentService', function ($resource, ConfigService) {

    var Agent = $resource(ConfigService.api + '/agents/:id', null, {
        'update': { method: 'PUT' },
        'remove': { method: 'DELETE' }
    });

    /**
     * Gets full name and affiliation as string.
     */
    Agent.prototype.getNameAsLink = function() {
        var fullName = [
            this.title,
            this.firstName,
            this.lastName
        ].join(" ");
        return "<a href=" + this.orcid + " target='_blank'>" + fullName + "</a>";
    };

    return Agent;

  });
