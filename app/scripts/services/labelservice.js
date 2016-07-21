'use strict';

/**
 * @ngdoc service
 * @name labelsApp.LabelService
 * @description
 * # LabelService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('LabelService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var labels = [
        {
        	"label": {
        		"vocab": ["http://labeling.i3mainz.hs-mainz.de/item/vocabulary/9c51004c-7746-4bfd-b4be-93e1d3551ebb"],
        		"creator": [],
        		"contributor": [],
        		"id": "1",
        		"license": [],
        		"prefLabel": ["chair@en", "Stuhl@de", "chaise@fr"],
        		"altLabel": [],
        		"note": ["this is the label note"],
        		"definition": [],
        		"preferredLabel": ["chair@en"],
        		"statusType": [],
        		"context": [],
        		"related": [],
        		"broader": [],
        		"narrower": [],
        		"relatedMatch": [],
        		"broadMatch": ["somethingbroad@en", "somethingbroader@en"],
        		"narrowMatch": ["somethingnarrow@en", "somethingnarrower@en"],
        		"closeMatch": [],
        		"exactMatch": [],
        		"seeAlso": [],
        		"definedBy": [],
        		"sameAs": [],
        		"created": [],
        		"modified": []
        	}
        },{
        	"label": {
        		"vocab": ["http://labeling.i3mainz.hs-mainz.de/item/vocabulary/9c51004c-7746-4bfd-b4be-93e1d3551ebb"],
        		"creator": [],
        		"contributor": [],
        		"id": "2",
        		"license": [],
        		"prefLabel": ["axel@en"],
        		"altLabel": [],
        		"note": [],
        		"definition": [],
        		"preferredLabel": ["axel@en"],
        		"statusType": [],
        		"context": [],
        		"related": [],
        		"broader": [],
        		"narrower": [],
        		"relatedMatch": [],
        		"broadMatch": [],
        		"narrowMatch": [],
        		"closeMatch": [],
        		"exactMatch": [],
        		"seeAlso": [],
        		"definedBy": [],
        		"sameAs": [],
        		"created": [],
        		"modified": []
        	}
        },{
        	"label": {
        		"vocab": ["http://labeling.i3mainz.hs-mainz.de/item/vocabulary/9c51004c-7746-4bfd-b4be-93e1d3551ebb"],
        		"creator": [],
        		"contributor": [],
        		"id": "3",
        		"license": [],
        		"prefLabel": ["kai@en"],
        		"altLabel": [],
        		"note": [],
        		"definition": [],
        		"preferredLabel": ["chair@en"],
        		"statusType": [],
        		"context": [],
        		"related": [],
        		"broader": [],
        		"narrower": [],
        		"relatedMatch": [],
        		"broadMatch": [],
        		"narrowMatch": [],
        		"closeMatch": [],
        		"exactMatch": [],
        		"seeAlso": [],
        		"definedBy": [],
        		"sameAs": [],
        		"created": [],
        		"modified": []
        	}
        },{
        	"label": {
        		"vocab": ["http://labeling.i3mainz.hs-mainz.de/item/vocabulary/9c51004c-7746-4bfd-b4be-93e1d3551ebb"],
        		"creator": [],
        		"contributor": [],
        		"id": "4",
        		"license": [],
        		"prefLabel": ["mainz@en"],
        		"altLabel": [],
        		"note": [],
        		"definition": [],
        		"preferredLabel": ["mainz@en"],
        		"statusType": [],
        		"context": [],
        		"related": [],
        		"broader": [],
        		"narrower": [],
        		"relatedMatch": [],
        		"broadMatch": [],
        		"narrowMatch": [],
        		"closeMatch": [],
        		"exactMatch": [],
        		"seeAlso": [],
        		"definedBy": [],
        		"sameAs": [],
        		"created": [],
        		"modified": []
        	}
        },{
        	"label": {
        		"vocab": ["http://labeling.i3mainz.hs-mainz.de/item/vocabulary/9c51004c-7746-4bfd-b4be-93e1d3551ebb"],
        		"creator": [],
        		"contributor": [],
        		"id": "5",
        		"license": [],
        		"prefLabel": ["wiesbaden@en"],
        		"altLabel": [],
        		"note": [],
        		"definition": [],
        		"preferredLabel": ["wiesbaden@en"],
        		"statusType": [],
        		"context": [],
        		"related": [],
        		"broader": [],
        		"narrower": [],
        		"relatedMatch": [],
        		"broadMatch": [],
        		"narrowMatch": [],
        		"closeMatch": [],
        		"exactMatch": [],
        		"seeAlso": [],
        		"definedBy": [],
        		"sameAs": [],
        		"created": [],
        		"modified": []
        	}
        },{
        	"label": {
        		"vocab": ["http://labeling.i3mainz.hs-mainz.de/item/vocabulary/9c51004c-7746-4bfd-b4be-93e1d3551ebb"],
        		"creator": [],
        		"contributor": [],
        		"id": "6",
        		"license": [],
        		"prefLabel": ["frankfurt@en"],
        		"altLabel": [],
        		"note": [],
        		"definition": [],
        		"preferredLabel": ["frankfurt@en"],
        		"statusType": [],
        		"context": [],
        		"related": [],
        		"broader": [],
        		"narrower": [],
        		"relatedMatch": [],
        		"broadMatch": [],
        		"narrowMatch": [],
        		"closeMatch": [],
        		"exactMatch": [],
        		"seeAlso": [],
        		"definedBy": [],
        		"sameAs": [],
        		"created": [],
        		"modified": []
        	}
        }
    ];

    this.query = function(success) {
        success(labels);
    };

    this.get = function(id, success) {
        labels.forEach(function(label) {
            if (label.label.id === id) {
                success(label);
            }
        });
    };
  });
