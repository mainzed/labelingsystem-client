'use strict';

/**
 * @ngdoc service
 * @name labelsApp.VocabService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('VocabService', function ($resource, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    return $resource('http://143.93.114.135/api/v1/vocabs/:id', null, {
        'update': { method:'PUT' }
    });

    // this.query = function(success) {
    //     $http.get('http://labeling.i3mainz.hs-mainz.de/api/v1/vocabs').then(function(res) {
    //         success(res.data.vocabs);
    //     });
    // };
    //
    // this.get = function(id, success) {
    //     $http.get('http://labeling.i3mainz.hs-mainz.de/api/v1/vocabs').then(function(res) {
    //         res.data.vocabs.forEach(function(vocab) {
    //             if (vocab.vocab.id[0] === id) {
    //                 success(vocab);
    //             }
    //         });
    //     });
    // };

  });
