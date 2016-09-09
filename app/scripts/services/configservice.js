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

    /**
     * If true, prevents users from editing the thumbnail prefLabel of a concept
     * if it's vocabulary has the releaseType "public". If false, allows editing
     * even if a vocabulary is public.
     */
    this.preventThumbnailEdit = true;

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

    // available  languages
    this.languages = [
        { name: "German", value: "de" },
        { name: "English", value: "en" },
        { name: "Spanish", value: "es" },
        { name: "Italian", value: "it" },
        { name: "French", value: "fr" },
        { name: "Dutch", value: "nl"},
        { name: "Hebrew", value: "he"}
    ];
});
