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
  });
