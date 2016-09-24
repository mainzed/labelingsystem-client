'use strict';

/**
 * @ngdoc service
 * @name labelsApp.VocabService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('VocabService', function ($resource, $http, AuthService, ConfigService, ThesauriService) {

    // the data model lives on the server!
    var Vocab = $resource(ConfigService.host + '/vocabs/:id', null, {
        'query': { method: 'GET', params: { draft: true }, isArray: true },
        'getPublicOnly': { method: 'GET', isArray: true },
        //'update': { method:'PUT' },
        'download' : { method: 'GET', url: ConfigService.host + '/vocabs/:id' + ".skos", isArray: false },
        'remove': { method: 'DELETE', params: { user: "demo", type: "delete" }}
    });

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
                    var checkedThesaurus = _.find(thesauri, { 'name': thesaurus.name });
                    if (checkedThesaurus) {  // skips local vocab 
                        checkedThesaurus.checked = true;
                    }
                });
                successCallback(thesauri);
            });
        });
    };

    Vocab.prototype.update = function(successCallback, errorCallback) {
        var me = this;

        // remove thesauri (TODO: florian ignore this property)
        delete me.thesauri;

        var jsonObj = {
            item: me,
            user: "demo"
        };

        $http.put(ConfigService.host + '/vocabs/' + me.id, jsonObj).then(function success(res) {
            successCallback(res);
        }, function error(res) {
            errorCallback(res);
        });

    };


    return Vocab;
});
