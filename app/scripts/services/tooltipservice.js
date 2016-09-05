'use strict';

/**
 * @ngdoc service
 * @name labelsApp.TooltipService
 * @description
 * # TooltipService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('TooltipService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.buttons = {
        description: {
            active: "this is the active description tooltip",
            inactive: "this is the inactive description tooltip",
        }
    };

    this.icons = {
        types: {
            label: "this is a label!",
            description: "This is a description!",
            prefLabel: "this is a preferred term!",
            altLabel: "this is an alternative term!"
        },
        relations: {
            closeMatch: "closeMatch!",
            exactMatch: "exactMatch!",
            relatedMatch: "relatedMatch!"
        }
    };

    this.explainations = {
        scopenote: "Describe current label with a few, clear words."
    }

  });
