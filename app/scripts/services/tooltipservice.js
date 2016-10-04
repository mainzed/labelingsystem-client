'use strict';

/**
 * @ngdoc service
 * @name labelsApp.TooltipService
 * @description
 * # TooltipService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('TooltipService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.buttons = {
        description: {
            active: "this is the active description tooltip",
            inactive: "this is the inactive description tooltip",
        }
    };

    this.icons = {
        types: {
            concept: "this is a concept!"
        },
        relations: {
            closeMatch: "closeMatch!",
            exactMatch: "exactMatch!",
            relatedMatch: "relatedMatch!"
        },
        translation: "this is a translation",
        description: "This is a description!",
        internalLink: "internal links",
        externalLink: "external links",
        thesauriSettings: "change thesauri settings",
        vocabSettings: "change vocab",
        minipreview: "this is the minipreview"
    };//

    this.comments = {
        description: "Describe current label with a few, clear words.",
        exactMatch: "skos:exactMatch is used to link two concepts, indicating a high degree of confidence that the concepts can be used interchangeably across a wide range of information retrieval applications.",
        relatedMatch: "skos:relatedMatch is used to state an associative mapping link between two conceptual resources in different concept schemes.",
        closeMatch: "skos:closeMatch is used to link two concepts that are sufficiently similar that they can be used interchangeably in some information retrieval applications.",
        broadMatch: "skos:broadMatch is used to state a hierarchical mapping link between two conceptual resources in different concept schemes.",
        narrowMatch: "skos:narrowMatch is used to state a hierarchical mapping link between two conceptual resources in different concept schemes.",
        related: "skos:related relates a concept to a concept with which there is an associative semantic relationship.",
        narrower: "skos:narrower relates a concept to a concept that is more specific in meaning.",
        broader: "skos:broader relates a concept to a concept that is more general in meaning."
    };

    this.explaination = {
        wayback: "Use Wayback links"
    }

  });
