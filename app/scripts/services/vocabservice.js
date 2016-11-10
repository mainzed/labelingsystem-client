"use strict";

/**
 * @ngdoc service
 * @name labelsApp.service:VocabService
 * @description
 * Service in the labelsApp. Gets the vocabularies using the LS Server API.
 */
angular.module("labelsApp")
  .factory("VocabService", function($resource, $q, $http, AuthService, ConfigService, ThesauriService) {

    var Vocab = $resource(ConfigService.api + "/vocabs/:id", null, {
        "query": {
            method: "GET",
            isArray: true
        },
        "remove": { method: "DELETE" }
    });

    /**
     * This will be an instance member.
     * @memberof Vocab.prototype
     */
    Vocab.prototype.getUrl = function() {
        return ConfigService.api + "/vocabs/" + this.id;
    };

    Vocab.prototype.getUri = function() {
        return ConfigService.host + "/item/vocabulary/" + this.id;
    };

    /**
     * Adds the property "thesauri" to the vocab object that contains all
     * searchable thesauri for this vocab. Selected ones have the attribute
     * checked=true.
     * skips local vocabs -> use ConceptService instead to get siblings
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
                    var checkedThesaurus = _.find(thesauri, { "name": thesaurus.name });
                    if (checkedThesaurus) {  // skips local vocab
                        checkedThesaurus.checked = true;
                    }

                    if (thesaurus.name.indexOf("this." + me.id) > -1) {
                        //console.log("foudn same vocab!");
                        thesaurus.checked = true;
                        thesauri.push(thesaurus);
                    }
                });

                // find all unchecked and give them checked: false to sort them later
                thesauri = _.filter(thesauri, function(o) {
                    if (!o.checked) {
                        o.checked = false;
                    }
                    return o;
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
        $http.get(ConfigService.api + "/retcat/vocabulary/" + me.id + "/list").then(function(res) {
            successCallback(res.data.id);  // return vocab ID
        }, function error(res) {
            errorCallback(res);
        });
    };

    Vocab.prototype.setEnrichmentVocab = function(id) {
        var deferred = $q.defer();
        var me = this;
        $http.put(ConfigService.api + "/retcat/vocabulary/" + me.id + "/list", {id: id}).then(function() {
            deferred.resolve();  // return vocab ID
        }, function error(res) {
            deferred.reject(res);
        });

        return deferred.promise;
    };

    Vocab.prototype.getCreatorFullName = function() {
        if (this.creatorInfo) {
            return [
                this.creatorInfo.firstName,
                this.creatorInfo.lastName
            ].join(" ");
        }
    };

    Vocab.prototype.getDraftConcepts = function() {
        var deferred = $q.defer();
        var me = this;

        $http.get(ConfigService.api + "/labels?draft=true&vocab=" + me.id).then(function(res) {
            deferred.resolve(_.filter(res.data, { releaseType: "draft"}));
        }, function error(res) {
            deferred.reject(res);
        });

        return deferred.promise;
    };

    Vocab.prototype.save = function(successCallback, errorCallback) {
        var me = this;

        $http.put(ConfigService.api + "/vocabs/" + me.id, me).then(function success(res) {
            successCallback(res);
        }, function error(res) {
            errorCallback(res);
        });
    };

    return Vocab;
});
