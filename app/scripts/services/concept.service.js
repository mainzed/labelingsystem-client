"use strict";

/**
 * @ngdoc service
 * @name labelsApp.ConceptService
 * @description
 * # ConceptService
 * Service in the labelsApp.
 */
angular.module("labelsApp")
.factory("ConceptService", function($resource, $http, ConfigService, ResourcesService) {

    var Concept = $resource(ConfigService.api + "/labels/:id", null, {
        "query": {
            method: "GET",
            params: { draft: true },
            isArray: true
        },
        "queryPublic": {
            method: "GET",
            params: { draft: false },
            isArray: true
        },
        "update": {
            method: "PUT"
        },
        "remove": {
            method: "DELETE"
        }
    });

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
        if (ConfigService.includeMatches) {
            return _.has(this, "broadMatch") || _.has(this, "broader");
        }
        return _.has(this, "broader");
    };

    Concept.prototype.hasNarrower = function() {
      if (ConfigService.includeMatches) {
          return _.has(this, "narrowMatch") || _.has(this, "narrower");
      }
      return _.has(this, "narrower");
    };

    Concept.prototype.hasRelated = function() {
      if (ConfigService.includeMatches) {
          return _.has(this, "related") || _.has(this, "relatedMatch")  || _.has(this, "closeMatch") || _.has(this, "exactMatch");
      }
      return _.has(this, "related");
    };

    Concept.prototype.hasMore = function() {
        return _.has(this, "description") || this.hasBroader() || this.hasNarrower() || this.hasRelated();
    }

    Concept.prototype.getDetails = function() {
        var me = this;

        if (ConfigService.includeMatches) {
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

        } else {
          return new Promise(function(resolve, reject) {

              Promise.all([
                  me.getRelatedConcepts("broader"),
                  me.getRelatedConcepts("narrower"),
                  me.getRelatedConcepts("related"),
              ]).then(function(values) {
                  resolve({
                      broader: values[0],
                      narrower: values[1],
                      related: values[2]
                  });
              });
          });
        }
    }

    /**
     * Gets all of a concept"s broader, narrower and related concepts and
     * returns a list of objects.
     * @param {String} relation - Relation to get concepts for
     */
     Concept.prototype.getRelatedConcepts = function(relation) {
        //console.log(Concept);
        var concept = this;

        // TODO: the concepts return dont have all the prototype functions
        // because ConceptService is not used!!!
        // maybe its better to leave this as helperfunction for now

        return new Promise(function(resolve, reject) {
            var relatedConcepts = [];
            if (concept[relation]) {
                 concept[relation].forEach(function(resource, index, array) {

                    $http.get(ConfigService.api + "/labels/" + resource).then(function(res) {
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
     * Gets all of a concept"s broader, narrower and related concepts and
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
                        ResourcesService.get({ uri: resource.uri }, function(relatedConcept) {
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

    Concept.prototype.getCreatorFullName = function() {
        if (this.creatorInfo) {
            return [
                this.creatorInfo.firstName,
                this.creatorInfo.lastName
            ].join(" ");
        }
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
                uri: concept.uri || ConfigService.host + "/item/label/" + concept.id
            });
        } else {
            console.log("failed to add child because of unknown relation: " + relation);
        }
    };

    /**
     * Returns a score based on how many links to other concepts it has.
     */
    Concept.prototype.getScore = function() {

        var qualityScore = 0;

        // gray boxes
        if (this.translations) {
            qualityScore += this.translations.length * ConfigService.scores.translation;
        }
        if (this.description) {
            qualityScore += ConfigService.scores.description;
        }
        if (this.seeAlso) {
            qualityScore += ConfigService.scores.wayback;
        }

        // internal concepts (white)
        if (this.broader) {
            qualityScore += this.broader.length * ConfigService.scores.concept;
        }
        if (this.related) {
            qualityScore += this.related.length * ConfigService.scores.concept;
        }
        if (this.narrower) {
            qualityScore += this.narrower.length * ConfigService.scores.concept;
        }

        // external  resources (blue and pink)
        if (this.broadMatch) {
            qualityScore += this.broadMatch.length * ConfigService.scores.resource;
        }
        if (this.narrowMatch) {
            qualityScore += this.narrowMatch.length * ConfigService.scores.resource;
        }
        if (this.relatedMatch) {
            qualityScore += this.relatedMatch.length * ConfigService.scores.resource;
        }
        if (this.closeMatch) {
            qualityScore += this.closeMatch.length * ConfigService.scores.resource;
        }
        if (this.exactMatch) {
            qualityScore += this.exactMatch.length * ConfigService.scores.resource;
        }

        return qualityScore;
    };

    /**
     * Sends the current version of the concept tp the server to update it.
     */
    Concept.prototype.save = function(successCallback, errorCallback) {
        var me = this;
        $http.put(ConfigService.api + "/labels/" + me.id, me).then(function(res) {
            successCallback(res.data);
        }, function() {
            errorCallback();
        });
    };

    return Concept;
});
