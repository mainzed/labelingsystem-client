'use strict';

/**
 * @ngdoc service
 * @name labelsApp.userSettings
 * @description
 * # userSettings
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('UserSettingsService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.showEnrichments = true;

  });
