'use strict';

/**
 * @ngdoc service
 * @name labelsApp.FilterService
 * @description
 * # FilterService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('FilterService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var searchFilter;
    var vocabFilter;

    this.getSearchFilter = function() {
        return searchFilter;
    };

    this.setSearchFilter = function(filter) {
        searchFilter = filter;
    };

    this.getVocabFilter = function() {
        return vocabFilter;
    };

    this.setVocabFilter = function(filter) {
        vocabFilter = filter;
    };

  });
