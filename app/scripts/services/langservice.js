'use strict';

/**
 * @ngdoc service
 * @name labelsApp.langService
 * @description
 * # langService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('LangService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.get = function() {
        return [
            { name: "German", value: "de" },
            { name: "English", value: "en" },
            { name: "Spanish", value: "es" },
            { name: "Italian", value: "it" }
        ];
    };
});
