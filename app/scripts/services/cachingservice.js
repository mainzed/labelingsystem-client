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

        var service = this;

        this.viewer = {
            vocabs: null,

            /**
             * Holds all concepts for a vocabulary.
             * concepts.vocabID - id of concepts' vocab
             * concepts.items - concepts
             */
            concepts: null, // concepts view

            allConcepts: null, // landing page
            filterValue: null
        };

        this.editor = {
            vocabs: null,
            vocabsWithCreator: null,
            concepts: null,
            showEnrichments: null
        };

        // same for editor and viewer
        this.filters = {
            vocabs: null,
            concepts: {
                vocabID: null,
                value: null
            }
        };

        /**
         * Returns the filter if the the vocab id matches.
         * @param {string} id - Vocabulary ID
         */
        this.getFilterByVocab = function(id) {
            if (this.filters.concepts && this.filters.concepts.vocabID === id) {
                return this.filters.concepts.value;
            } else {
                return;
            }
        };

        this.reset = function() {
            console.log("reset");
            // service.viewer = {
            //     vocabs: null,
            //     concepts: null, // concepts view
            //     allConcepts: null, // landing page
            //     landingSearchResults: null,
            //     filterValue: null
            // };
            // service.editor = {
            //     vocabs: null,
            //     vocabsWithCreator: null,
            //     concepts: null,
            //     showEnrichments: null
            // };
            // service.filters = {
            //     vocabs: null,
            //     concepts: {
            //         vocabID: null,
            //         value: null
            //     }
            // };

            console.log(service.editor.vocabs);
        }
    });
