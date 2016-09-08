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

    this.showEnrichments = true;

    this.labelOrder;

    this.extendAll = false;


  });
