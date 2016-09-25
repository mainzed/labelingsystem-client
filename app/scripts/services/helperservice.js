'use strict';

/**
 * @ngdoc service
 * @name labelsApp.helperService
 * @description
 * # helperService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('HelperService', function ($window, LabelService, ResourcesService, VocabService, AuthService) {
    // helper functions
    // this.findAndReplace = function(arr, query, newObj) {
    //     var index = _.indexOf(arr, _.find(arr, query));
    //     arr.splice(index, 1, newObj);
    // };

    /**
     * Determines the term of a concept or match and returns it.
     * @param {Object} obj - concept or match
     * @returns {String} - concept thumbnail-prefLabel or match term
     */
    // this.getTerm = function(obj) {
    //     if (obj.prefLabels) {  // is concept object
    //         return this.getThumbnail(obj).value;
    //     } else {  // is match
    //         return obj.label;
    //     }
    // };

    /**
     * Gets all of a concept's broader, narrower and related concepts and
     * returns a list of objects.
     * @param {Object} concept - A Labeling System concept (formerly 'label')
     * @param {String} relation - Relation to get concepts for
     * @param {function} callback - Callback that returns the related concepts
     */
    this.getRelatedConcepts = function(concept, relation, callback) {
        var relatedConcepts = [];
        if (concept[relation]) {
            concept[relation].forEach(function(resource, index, array) {

                if (_.isString(resource)) {  // is internal concept ID
                    LabelService.get({id: resource}, function(relatedConcept) {
                        relatedConcepts.push(relatedConcept);
                        // callback when all done
                        if (index === array.length - 1) {
                            callback(relatedConcepts);
                        }
                    });
                } else if (resource.uri) {  // is external resource
                    ResourcesService.get(resource.uri, function(relatedConcept) {
                        relatedConcepts.push(relatedConcept);

                        // callback when all done
                        if (index === array.length - 1) {
                            callback(relatedConcepts);
                        }
                    });
                } else {
                    console.log("unknown resource:");
                    console.log(resource);
                }
            });
        } else {
            callback(relatedConcepts);
        }
    };

    /**
     * Opens a url in new tab.
     * @param {string} url
    */
    this.openLinkInNewTab = function(url) {
        $window.open(url, "_blank");
    };

    /**
     * Changes a vocabulary's releaseType from "draft" to "public".
     * @param {object} vocab - Vocabulary object
     */
     // TODO: move to vocab
    this.publishVocab = function(vocab) {
        return new Promise(function(resolve, reject) {
            var updatedVocab = vocab;
            updatedVocab.releaseType = "public";
            VocabService.update({id: vocab.id}, {
                user: "demo",
                item: updatedVocab
            }, function() {
                resolve();
            }, function(error) {
                reject(error);
            });
        });
    };

  });
