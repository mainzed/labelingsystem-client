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

    // host adress of the used labeling system api
    this.host = "http://143.93.114.135/api/v1";

    // true allows a thumbnail-prefLabel to be edited even if it's vocabulary
    // releaseType is 'public'. false prevents public thumbnail-prefLabels from
    // being edited.
    this.allowThumbnailEdit = false;

    // true shows internal broader and narrower as well as external broadMatches
    // and narrowMatches in concept overviews or small box details. false shows
    // only internal relations.
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

});
