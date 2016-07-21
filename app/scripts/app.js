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
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl'
      })
      .when('/vocabularies', {
        templateUrl: 'views/vocabularies.html',
        controller: 'MainCtrl'
      })
      .when('/vocabularies/:vID/labels', {
        templateUrl: 'views/labels.html',
        controller: 'MainCtrl'
      })

      .when('/admin', {
        redirectTo: '/admin/login'
      })
      .when('/admin/login', {
        templateUrl: 'views/admin-login.html',
        controller: 'LoginCtrl'
      })
      .when('/admin/vocabularies', {
        templateUrl: 'views/admin-vocabularies.html',
        controller: 'MainCtrl'
      })
      .when('/admin/vocabularies/:vID/labels', {
        templateUrl: 'views/admin-labels.html',
        controller: 'MainCtrl'
      })
      .when('/admin/vocabularies/:vID/labels/:lID', {
        templateUrl: 'views/admin-label-detail.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
