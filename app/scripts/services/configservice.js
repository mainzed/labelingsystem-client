'use strict';

/**
 * @ngdoc service
 * @name labelsApp.configService
 * @description
 * # configService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('ConfigService', function () {

    // webapp version number
    this.version = "v0.3";

    // host adress of the used labeling system api
    this.host = "http://143.93.114.135";

    this.api = this.host + "/api/v1";

    /**
     * If true, shows broadMatches and narrowMatches in broader/narrower columns
     * in the concept detail box. If false, only shows broader and narrower
     * concepts of the same vocabulary.
     */
    this.showMatches = true;

    // score values for a concept's properties and links to grade it's quality
    this.scores = {
        // property
        prefLabel: 1,
        altLabel: 1,
        scopeNote: 1,

        // linked internal concept (broader, narrower, related)
        concept: 5,

        // linked resource (broadMatch, narrowmatch etc.)
        wayback: 1,
        fao: 3,
        finto: 3,
        dbpedia: 3,
        ls: 5,
        getty: 5,
        heritagedata: 5,
        chronontology: 5
    };

    // limit of concepts shown in concepts overview and enrichment-browser 'concepts'-tab
    // and on landing page
    this.conceptsLimit = 30;

    // maximum number of characters allowed for a vocab's title
    this.vocabTitleLength = 40;

    // maximum number of characters allowed for a vocab's description
    this.vocabDescriptionLength = 160;

    // maximum number of characters allowed for a concept's label
    this.maxConceptLabelLength = 40;

    // maximum number of characters allowed for a concept's description
    this.maxConceptDescriptionLength = 400;

});
