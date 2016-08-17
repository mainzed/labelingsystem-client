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
            label: "this is the label icon!",
            description: "this is the scopeNote icon!",
            prefLabel: "this is the preflabel icon!",
            altLabel: "this is the altlabel icon!"
        },
        relations: {
            closeMatch: "closeMatch!",
            exactMatch: "exactMatch!",
            relatedMatch: "relatedMatch!"
        }
    };

  });
