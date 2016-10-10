'use strict';

/**
 * @ngdoc service
 * @name labelsApp.TooltipService
 * @description
 * # TooltipService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
    .service('CachingService', function() {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.viewer = {
            vocabs: null,

            /**
             * Holds all concepts for a vocabulary.
             * concepts.vocabID - id of concepts' vocab
             * concepts.items - concepts
             */
            concepts: null, // concepts view

            allConcepts: null // landing page
        };

        this.editor = {
            vocabs: null,
            vocabsWithCreator: null,
            concepts: null
        };

        this.filters = {
            vocabs: null,
            concepts: {
                vocabID: null,
                value: null
            }  // concepts.vocabID, concepts.value
        };
    });
