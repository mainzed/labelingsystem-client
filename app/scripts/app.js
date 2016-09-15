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
        templateUrl: 'views/label-detail.html',
        controller: 'LabelDetailCtrl'
      })

      .when('/admin', {
        redirectTo: '/admin/login'
      })
      .when('/admin/login', {
        templateUrl: 'views/admin-login.html',
        controller: 'LoginCtrl'
      })

      // vocabularies
      .when('/admin/vocabularies', {
        templateUrl: 'views/admin-vocabularies.html',
        controller: 'VocabsCtrl'
      })

      // vocabulary's concepts overview
      .when('/admin/vocabularies/:vID/concepts', {
        templateUrl: 'views/admin-labels.html',
        controller: 'LabelsCtrl'
      })
      .when('/admin/vocabularies/:vID', {
        redirectTo: '/admin/vocabularies/:vID/concepts'
      })

      // concept details
      .when('/admin/vocabularies/:vID/concepts/:lID', {
        templateUrl: 'views/admin-label-detail.html',
        controller: 'LabelDetailCtrl',
        controllerAs: 'LabelDetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
 });
