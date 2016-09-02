'use strict';

/**
 * @ngdoc service
 * @name labelsApp.helperService
 * @description
 * # helperService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('HelperService', function () {
    // helper functions
    this.findAndReplace = function(arr, query, newObj) {
        var index = _.indexOf(arr, _.find(arr, query));
        arr.splice(index, 1, newObj);
    };

  });
