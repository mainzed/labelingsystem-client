'use strict';

/**
 * @ngdoc service
 * @name labelsApp.helperService
 * @description
 * # helperService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('HelperService', function (LabelService) {
    // helper functions
    this.findAndReplace = function(arr, query, newObj) {
        var index = _.indexOf(arr, _.find(arr, query));
        arr.splice(index, 1, newObj);
    };

    /**
     * Determines the thumbnail prefLabel of a concept.
     * @param {Object} concept
     * @returns {Object} - prefLabel Object
     */
    this.getThumbnail = function(concept) {
        for (var i = 0; i < concept.prefLabels.length; i++) {
            if (concept.prefLabels[i].isThumbnail) {
                return concept.prefLabels[i].value;
            }
        }
    };

    /**
     * Determines the term of a concept or match and returns it.
     * @param {Object} obj - concept or match
     * @returns {String} - concept thumbnail-prefLabel or match term
     */
    this.getTerm = function(obj) {
        if (obj.prefLabels) {  // is concept object
            return this.getThumbnail(obj);
        } else {  // is match
            return obj.label;
        }
    };

    /**
     * Gets all of a concept's broader, narrower and related concepts and
     * returns a list of objects.
     * @param {Object} concept - A Labeling System concept (formerly 'label')
     * @returns {Array}
     */
    this.getConceptRelations = function(concept, success) {
        var relations = ["broader", "narrower", "related"];
        var results = [];
        relations.forEach(function(relation) {
            if (concept[relation]) {
                concept[relation].forEach(function(id) {

                    LabelService.get({id: id}, function(relatedConcept) {
                        results.push({
                            relation: relation,
                            resource: relatedConcept
                        });
                    });
                });
            }
        });
        success(results);
    };

  });
