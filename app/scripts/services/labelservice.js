'use strict';

/**
 * @ngdoc service
 * @name labelsApp.LabelService
 * @description
 * # LabelService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .factory('LabelService', function ($resource, $http, ConfigService, ResourcesService) {

    var Concept = $resource(ConfigService.api + '/labels/:id', null, {
        'query': {
            method: 'GET',
            params: { draft: true },
            isArray: true
        },
        'queryPublic': {
            method: 'GET',
            params: { draft: false },
            isArray: true
        },
        'getWithRevisions': {
            method: 'GET',
            params: { revisions: true },
            isArray: false
        },
        'update': {
            method: 'PUT'
        },
        'remove': {
            method: 'DELETE'
        }
    });

    /**
     * returns the concept's thumbnail prefLabel.
     */
    Concept.prototype.getLabel = function() {
        return this.thumbnail;
    };

    Concept.prototype.setLabel = function(value) {
        this.thumbnail = value;
    };

    Concept.prototype.getUrl = function() {
        return ConfigService.api + "/labels/" + this.id;
    };

    Concept.prototype.getUri = function() {
        return ConfigService.host + "/item/label/" + this.id;
    };

    /**
     * Gets this concepts language.
     */
    Concept.prototype.getLang = function() {
        return this.language;
    };

    Concept.prototype.hasBroader = function() {
        return this.broadMatch || this.broader;
    };

    /**
     * checks if concept has narrower concepts
     */
    Concept.prototype.hasNarrower = function() {
        return this.narrowMatch || this.narrower;
    };

    Concept.prototype.hasRelated = function() {
        return this.related || this.relatedMatch || this.closeMatch || this.exactMatch;
    };

    Concept.prototype.hasMore = function() {
        return this.description || this.hasBroader() || this.hasNarrower();
    }

    Concept.prototype.getDetails = function() {
        var me = this;

        return new Promise(function(resolve, reject) {

            Promise.all([
                me.getRelatedConcepts("broader"),
                me.getRelatedMatches("broadMatch"),
                me.getRelatedConcepts("narrower"),
                me.getRelatedMatches("narrowMatch"),
                me.getRelatedConcepts("related"),
                me.getRelatedMatches("relatedMatch"),
                me.getRelatedMatches("closeMatch"),
                me.getRelatedMatches("exactMatch")

            ]).then(function(values) {
                resolve({
                    broader: values[0],
                    broadMatches: values[1],
                    narrower: values[2],
                    narrowMatches: values[3],
                    related: values[4],
                    relatedMatches: values[5],
                    closeMatches: values[6],
                    exactMatches: values[7]
                });
            });
        });
    }

    /**
     * Gets all of a concept's broader, narrower and related concepts and
     * returns a list of objects.
     * @param {String} relation - Relation to get concepts for
     */
     Concept.prototype.getRelatedConcepts = function(relation) {
        //console.log(Concept);
        var concept = this;

        // TODO: the concepts return dont have all the prototype functions
        // because LabelService is not used!!!
        // maybe its better to leave this as helperfunction for now

        return new Promise(function(resolve, reject) {
            var relatedConcepts = [];
            if (concept[relation]) {
                 concept[relation].forEach(function(resource, index, array) {

                    $http.get(ConfigService.api + '/labels/' + resource).then(function(res) {
                        relatedConcepts.push(res.data);
                        // callback when all done
                        if (index === array.length - 1) {
                            resolve(relatedConcepts);
                        }
                    });
                });
            } else {
                resolve(relatedConcepts);
            }
        });
    };

    /**
     * Gets all of a concept's broader, narrower and related concepts and
     * returns a list of objects.
     * @param {String} relation - Relation to get concepts for
     */
    Concept.prototype.getRelatedMatches = function(relation) {
        var concept = this;

        return new Promise(function(resolve, reject) {
           var relatedConcepts = [];
           if (concept[relation]) {
                concept[relation].forEach(function(resource, index, array) {

                    if (resource.uri) {  // is external resource
                        ResourcesService.get(resource.uri, function(relatedConcept) {
                            relatedConcepts.push(relatedConcept);

                            // callback when all done
                            if (index === array.length - 1) {
                                resolve(relatedConcepts);
                            }
                        }, function error(res) {
                            console.log(res);
                        });
                    }
                });
            } else {
                resolve(relatedConcepts);
            }
        });

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
                type: concept.type || "ls",
                uri: concept.uri || "http://143.93.114.135/item/label/" + concept.id
            });
        } else {
            console.log("failed to add child because of unknown relation: " + relation);
        }
    };

    /**
     * Returns a score based on how many links to other concepts it has.
     */
    Concept.prototype.getScore = function() {
        var me = this;

        var qualityScore = 0;

        // gray boxes
        if (this.translations) {
            qualityScore += this.translations.length * ConfigService.scores.prefLabel;
        }
        if (this.description) {
            qualityScore += ConfigService.scores.scopeNote;
        }
        if (this.seeAlso) {
            qualityScore += ConfigService.scores.wayback;
        }

        // blue and green boxes
        var matchType = [
            "closeMatch",
            "exactMatch",
            "relatedMatch",
            "broadMatch",
            "narrowMatch"
        ];
        matchType.forEach(function(matchType) {
            if (me[matchType]) {
                me[matchType].forEach(function(match) {
                    if (ConfigService.scores[match.type]) {
                        qualityScore += ConfigService.scores[match.type];
                    }
                });
            }
        });

        // blue boxes
        if (this.broader) {
            qualityScore += this.broader.length * ConfigService.scores.concept;
        }
        if (this.related) {
            qualityScore += this.related.length * ConfigService.scores.concept;
        }
        if (this.narrower) {
            qualityScore += this.narrower.length * ConfigService.scores.concept;
        }

        function getMatchScore(matchType) {
            var score = 0;
            if (me[matchType]) {
                me[matchType].forEach(function(match) {
                    if (ConfigService.scores[match.type]) {
                        score += ConfigService.scores[match.type];
                    } else {
                        console.log("unknown match type: " + match.type + ". add score for this type in ConfigService!");
                    }
                });
            }
            return score;
        }

        //console.log(qualityScore);
        return qualityScore;
    };

    /**
     * Sends the current version of the concept tp the server to update it.
     */
    Concept.prototype.save = function(successCallback, errorCallback) {
        var me = this;
        $http.put(ConfigService.api + '/labels/' + me.id, me).then(function(res) {
            successCallback(res.data);
        }, function() {
            errorCallback();
        });
    };

    return Concept;

  });
