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

        this.toggles = {
            extendAll: null
        };

        this.extendAll = {};

        this.order = {};

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
            this.viewer = {
                vocabs: null,
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
                }
            };
            this.toggles = {
                extendAll: null
            };
            this.extendAll = {};
            this.showEnrichments = null;
            this.order = {};
        }
    });
