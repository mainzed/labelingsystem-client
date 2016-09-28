'use strict';

/**
 * @ngdoc service
 * @name labelsApp.VocabService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('VocabService', function ($resource, $q, $http, AuthService, ConfigService, ThesauriService) {

    // the data model lives on the server!
    var Vocab = $resource(ConfigService.host + '/vocabs/:id', null, {
        'query': { method: 'GET', params: { draft: true }, isArray: true },
        'getPublicOnly': { method: 'GET', isArray: true },
        //'update': { method:'PUT' },
        'download' : { method: 'GET', url: ConfigService.host + '/vocabs/:id' + ".skos", isArray: false },
        'remove': { method: 'DELETE', params: { user: "demo", type: "delete" }}
    });

    Vocab.prototype.getUrl = function() {
        return ConfigService.host + "/vocabs/" + this.id;
    };

    /**
     * Adds the property "thesauri" to the vocab object that contains all
     * searchable thesauri for this vocab. Selected ones have the attribute
     * checked=true.
     * skips local vocabs -> use LabelService instead to get siblings
     */
    Vocab.prototype.getThesauri = function(successCallback) {
        var me = this;

        // get all available thesauri
        ThesauriService.query(function(thesauri) {

            // get this vocabs thesauri
            ThesauriService.get({id: me.id}, function(vocabThesauri) {

                // preselect all vocab thesauri
                angular.forEach(vocabThesauri, function(thesaurus) {
                    //console.log(thesaurus.name);

                    //console.log(thesaurus.name);
                    var checkedThesaurus = _.find(thesauri, { 'name': thesaurus.name });
                    if (checkedThesaurus) {  // skips local vocab
                        checkedThesaurus.checked = true;
                    }
                });
                successCallback(thesauri);
            });
        });
    };

    /**
     * Update this vocabs thesauri.
     * @param {Object[]} thesauri - Array of thesaurus objects
     */
    Vocab.prototype.setThesauri = function(thesauri, successCallback, errorCallback) {
        var me = this;

        thesauri = _.filter(thesauri, function(o) {
            return o.checked;
        });

        // get all available thesauri
        ThesauriService.update({id: me.id }, thesauri, function(res) {
            successCallback();
        }, function error(res) {
            errorCallback(res);
        });
    };

    /**
     * Gets the vocabulary ID of the vocab that is shown in the enrichment
     * browser.
     */
    Vocab.prototype.getEnrichmentVocab = function(successCallback, errorCallback) {
        var me = this;
        $http.get(ConfigService.host + '/retcat/vocabulary/' + me.id + '/list').then(function(res) {
            successCallback(res.data.id);  // return vocab ID
        }, function error(res) {
            errorCallback(res);
        });
    };

    Vocab.prototype.getDraftConcepts = function() {
        var me = this;

        var deferred = $q.defer();

        $http.get(ConfigService.host + '/labels?draft=true&vocab=' + me.id).then(function(res) {
            deferred.resolve(_.filter(res.data, { releaseType: "draft"}));
        }, function error(res) {
            deferred.reject(res);
        });

        return deferred.promise;
    };

    Vocab.prototype.save = function(successCallback, errorCallback) {
        var me = this;

        $http.put(ConfigService.host + '/vocabs/' + me.id, me).then(function success(res) {
            successCallback(res);
        }, function error(res) {
            errorCallback(res);
        });
    };


    return Vocab;
});
