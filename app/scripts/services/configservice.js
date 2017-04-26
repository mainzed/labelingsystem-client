'use strict';

/**
 * @ngdoc service
 * @name labelsApp.ConfigService
 * @description
 * # configService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('ConfigService', function () {

    // webapp version number
    this.version = "lucy edition";

    // host adress of the used labeling system api
    this.host = "http://labeling.link";
    // name of item servlet and vocabulary and concept instances
    this.itemVocabulary = this.host + "/" + "item" + "/" + "vocab" + "/"; // dev item vocabulary - labeling.link item vocab
    this.itemConcept = this.host + "/" + "item" + "/" + "concept" + "/"; // dev item label - labeling.link item concept

    this.api = this.host + "/api/v1";

    /**
     * If true, shows broadMatches and narrowMatches in broader/narrower columns
     * in the concept detail box. If false, only shows broader and narrower
     * concepts of the same vocabulary.
     */
    this.includeMatches = true;

    // score values for a concept's properties and links to grade it's quality
    this.scores = {
        translation: 1,
        description: 1,
        concept: 5,  // white
        resources: 5, // blue and red
        wayback: 1
    };

    // limit of concepts shown in concepts overview and enrichment-browser 'concepts'-tab
    // and on landing page
    this.conceptsLimit = 50;
    // TODO
    //this.enrichtmentConceptsLimit = 30;

    // maximum number of characters allowed for a vocab's title
    this.vocabTitleLength = 40;

    // maximum number of characters allowed for a vocab's description
    this.vocabDescriptionLength = 160;

    // maximum number of characters allowed for a concept's label
    this.maxConceptLabelLength = 40;

    // maximum number of characters allowed for a concept's description
    this.maxConceptDescriptionLength = 400;

    // use cache for vocabs in editor mode
    this.cacheEditorVocabs = false;

    // use cache for vocabs in viewer mode
    this.cacheViewerVocabs = true;

    // TODO caching
    // this.cacheEditorConcepts = false;
    // this.cacheViewerConcepts = true;
    // this.cacheEditorConceptsDetail = false;
    // this.cacheViewerConceptsDetail = true;

});
