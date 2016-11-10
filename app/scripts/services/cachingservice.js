'use strict';

/**
 * @ngdoc service
 * @name labelsApp.service.CachingService
 * @description
 * # TooltipService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
    .service('CachingService', function() {

        var service = this;

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

        this.init = function() {
            service.viewer = {
                vocabs: null,
                concepts: null, // concepts view
                allConcepts: null, // landing page
                filterValue: null
            };

            service.editor = {
                vocabs: null,
                vocabsWithCreator: null,
                concepts: null,
                vocab: null,
                showEnrichments: null
            };

            service.editor = {
                vocabs: null,
                vocabsWithCreator: null,
                concepts: null,
                vocab: null,
                showEnrichments: null
            };

            // same for editor and viewer
            service.filters = {
                vocabs: null,
                concepts: {
                    vocabID: null,
                    value: null
                }
            };
        };

        this.init();
    });
