'use strict';

/**
 * @ngdoc overview
 * @name labelsApp
 * @description
 * # labelsApp
 *
 * Main module of the application.
 */
angular
  .module('labelsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngDialog'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl'
      })
      .when('/vocabularies', {
        templateUrl: 'views/vocabularies.html',
        controller: 'VocabsCtrl'
      })
      .when('/vocabularies/:vID/labels', {
        templateUrl: 'views/labels.html',
        controller: 'LabelsCtrl'
      })
      .when('/vocabularies/:vID/labels/:lID', {
        template: '<ls-label-details></ls-label-details>'
      })





      .when('/admin', {
        redirectTo: '/admin/login'
      })
      .when('/admin/login', {
        template: '<ls-login></ls-login>'
      })
      .when('/admin/vocabularies', {
        templateUrl: 'views/admin-vocabularies.html',
        controller: 'VocabsCtrl'
      })
      // vocabulary's concepts overview
      .when('/admin/vocabularies/:vID/concepts', {
        template: '<ls-labels-overview></ls-labels-overview>'
      })
      .when('/admin/vocabularies/:vID', {
        redirectTo: '/admin/vocabularies/:vID/concepts'
      })

      // concept details
      .when('/admin/vocabularies/:vID/concepts/:lID', {
        template: '<ls-label-details></ls-label-details>'
      })
      .otherwise({
        redirectTo: '/'
      });
 });
