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
        template: '<ls-landing></ls-landing>'
      })

      .when('/admin', {
        redirectTo: '/admin/login'
      })
      .when('/admin/login', {
        template: '<ls-login></ls-login>'
      })
      .when('/admin/vocabularies', {
        template: '<ls-vocabs></ls-vocabs>'
      })
      // vocabulary's concepts overview
      .when('/admin/vocabularies/:vID/concepts', {
        template: '<ls-concepts></ls-concepts>'
      })
      .when('/admin/vocabularies/:vID', {
        redirectTo: '/admin/vocabularies/:vID/concepts'
      })

      // concept details
      .when('/admin/vocabularies/:vID/concepts/:lID', {
        template: '<ls-concept-detail></ls-concept-detail>'
      })
      .otherwise({
        redirectTo: '/'
      });
 });
