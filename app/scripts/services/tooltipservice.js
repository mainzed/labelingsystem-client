"use strict";

/**
 * @ngdoc service
 * @name labelsApp.TooltipService
 * @description
 * Service in the labelsApp. Holds all the used tooltips throughout the application.
 * @propertyOf {Object} Button tooltips
 */
angular.module("labelsApp")
    .service("TooltipService", function() {
        // AngularJS will instantiate a singleton by calling "new" on this function

        /**
         * This will be a static member, Observable.cache.
         * @propertyOf {Object} Button tooltips
         */
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
            vocabSettings: "change vocabulary",
            minipreview: "this is the minipreview"
        }; //

        this.comments = {
            description: "Describe current concept with a few, clear words.",
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
            wayback: "Use Wayback links",
            publication: "By pressing this button you make this vocabulary and all its concepts public. You may not delete concepts of this vocabulary anymore. Furthermore, the concepts of this vocabulary can be still edited and a revision history will be created. In this case, be carefull and do not change the meaning of the concept. Somebody could have used it as a reference."
        };
    });
