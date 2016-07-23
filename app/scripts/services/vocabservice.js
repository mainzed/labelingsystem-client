'use strict';

/**
 * @ngdoc service
 * @name labelsApp.VocabService
 * @description
 * # VocabService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('VocabService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var vocabularies = [
        {
            "vocab": {
                "title": ["furniture@en"],
                "description": ["Something in the room@en"],
        		"releaseType": ["draft"],
        		"statusType": [],
        		"theme": [],
        		"created": ["03.01.2016"],
        		"modified": [],
        		"topConcept": [],
        		"creator": [],
        		"contributor": [],
        		"id": "9c51004c-7746-4bfd-b4be-93e1d3551ebb",
        		"license": ["CC-BY-SA 4.0"]
            }
        },{
            "vocab": {
                "title": ["cities@en"],
                "description": ["Beautiful cities!"],
        		"releaseType": ["draft"],
        		"statusType": [],
        		"theme": [],
        		"created": ["01.01.2016"],
        		"modified": [],
        		"topConcept": [],
        		"creator": [],
        		"contributor": [],
        		"id": "second-vocab-id",
        		"license": ["CC-BY-SA 4.0"]
            }
        },{
            "vocab": {
                "title": ["gamma@en"],
                "description": ["All the gamma nerds"],
        		"releaseType": ["draft"],
        		"statusType": [],
        		"theme": [],
        		"created": ["02.01.2016"],
        		"modified": [],
        		"topConcept": [],
        		"creator": [],
        		"contributor": [],
        		"id": "third-vocab-id",
        		"license": ["CC-BY-SA 4.0"]
            }
        }
    ];

    this.query = function(success) {
        success(vocabularies);
    };

    this.get = function(id, success) {
        vocabularies.forEach(function(vocabulary) {
            if (vocabulary.vocab.id === id) {
                success(vocabulary);
            }
        });
    };

  });
