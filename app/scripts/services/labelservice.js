'use strict';

/**
 * @ngdoc service
 * @name labelsApp.LabelService
 * @description
 * # LabelService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('LabelService', function ($resource, $http, AuthService, ConfigService) {

    var Concept = $resource(ConfigService.host + '/labels/:id', null, {
        'update': {
            method: 'PUT'
        },
        'remove': {
            method: 'DELETE',
            params: {
                user: AuthService.getUser().name,
                type: "delete"
            }
        }
    });

    /**
     * returns the concept's thumbnail prefLabel.
     */
    Concept.prototype.getLabel = function() {
        return _.find(this.prefLabels, {isThumbnail: true});
    };

    /**
     * returns the concept's prefLabels that are not the thumbnail prefLabel.
     * @returns {Object[]} Array of prefLabel Objects
     */
    Concept.prototype.getTranslations = function() {
        return _.filter(this.prefLabels, {isThumbnail: false});
    };

    /**
     * Appends the new translation to the concept and calls the update function.
     */
    Concept.prototype.addTranslation = function(translation) {
        translation.isThumbnail = false;  // so the user doesnt have to add it
        this.prefLabels.push(translation);
    };

    /**
     * Gets this concepts language.
     */
    Concept.prototype.getLang = function() {
        return this.getLabel().lang;
    };

    Concept.prototype.delete = function(successCallback, errorCallback) {
        var me = this;
        $http.delete(ConfigService.host + '/labels/' + me.id, {
            user: "demo",
            type: "delete"
        }).then(function() {
            successCallback();
        }, function() {
            errorCallback();
        });
    };

    /**
     * Sets the description and adds language automatically.
     */
    Concept.prototype.setDescription = function(value) {
        this.scopeNote = {
            value: value,
            lang: this.getLang()
        };
    };

    /**
     * Adds another concept, resource or wayback link to this concept.
     * @param {string} id - ID or URI
     * @param {string} relation - relation array to add child to (e.g. "broader")
     */
    Concept.prototype.addChild = function(concept, relation) {

        function isSiblingConcept() {
            return relation === "broader" || relation === "narrower" || relation === "related";
        }

        function isExternalConcept() {
            return relation === "narrowMatch" || relation === "broadMatch" || relation === "closeMatch" || relation === "relatedMatch" || relation === "exactMatch";
        }

        function isWaybackLink() {
            return relation === "seeAlso";
        }

        // init array if it doesnt exist already
        if (!this[relation]) {
            this[relation] = [];
        }

        if (isWaybackLink()) {
            this[relation].push({
                type: "wayback",
                uri: concept.uri
            });

        } else if (isSiblingConcept()) {

            // aquired via ResourcesService, extract id from uri
            if (concept.uri) {
                concept.id = concept.uri.split("/").pop();
            }
            this[relation].push(concept.id);

        } else if (isExternalConcept()) {
            // is external concept
            this[relation].push({
                type: concept.type,
                uri: concept.uri
            });
        } else {
            console.log("failed to add child because of unknown relation: " + relation);
        }
    };

    // Concept.prototype.getSiblings = function() {
    //     var me = this;
    //     return new Promise(function(resolve, reject) {
    //         $http.get(ConfigService.host + '/labels?vocab=' + me.vocabID).then(function(res) {
    //             resolve(res.data);
    //         }, function error(res) {
    //             reject(res);
    //         });
    //     });
    //
    //
    // };

    // var p1 = new Promise(
    //     // The resolver function is called with the ability to resolve or
    //     // reject the promise
    //     function(resolve, reject) {
    //         log.insertAdjacentHTML('beforeend', thisPromiseCount +
    //             ') Promise started (<small>Async code started</small>)<br/>');
    //         // This is only an example to create asynchronism
    //         window.setTimeout(
    //             function() {
    //                 // We fulfill the promise !
    //                 resolve(thisPromiseCount);
    //             }, Math.random() * 2000 + 1000);
    //     }
    // );

    /**
     * Sends the current version of the concept tp the server to update it.
     */
    Concept.prototype.save = function(successCallback, errorCallback) {
        var me = this;
        $http.put(ConfigService.host + '/labels/' + me.id, {
            item: me,
            user: "demo"
        }).then(function() {
            successCallback();
        }, function() {
            errorCallback();
        });
    };


    return Concept;

  });
