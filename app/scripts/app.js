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

      // viewer
      .when('/', {
        template: '<ls-landing></ls-landing>',
        access: {restricted: false}
      })
      .when('/vocabularies', {
        template: '<ls-vocabs-viewer></ls-vocabs-viewer>',
        access: {restricted: false}
      })
      .when('/vocabularies/:vID/concepts', {
        template: '<ls-concepts-viewer></ls-concepts-viewer>',
        access: {restricted: false}
      })
      .when('/vocabularies/:vID/concepts/:lID', {
        template: '<ls-concept-detail-viewer></ls-concept-detail-viewer>',
        access: {restricted: false}
      })

      // editor
      .when('/admin/login', {
        template: '<ls-login></ls-login>',
        access: {restricted: false}
      })
      .when('/admin/vocabularies', {
        template: '<ls-vocabs></ls-vocabs>',
        access: {restricted: true}
      })
      .when('/admin/vocabularies/:vID/concepts', {
        template: '<ls-concepts></ls-concepts>',
        access: {restricted: true}
      })
      .when('/admin/vocabularies/:vID/concepts/:lID', {
        template: '<ls-concept-detail></ls-concept-detail>',
        access: {restricted: true}
      })

      // redirects
      .when('/admin/vocabularies/:vID', {
        redirectTo: '/admin/vocabularies/:vID/concepts',
      })
      .otherwise({
        redirectTo: '/'
      });
 });

angular.module('labelsApp').run(function ($rootScope, $location, $route, AuthService) {
    // do this before a route is changed
    // to prevent this for public routes use "access: {restricted: true}"
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        //if (next.access) {  // allow unit tests
        // sets user object before everything else so that isLoggedIn is synchronous
        AuthService.getUserStatus().then(function() {
            if (next.access.restricted && !AuthService.isLoggedIn()) {
                $location.path('/admin/login');
                $route.reload();

            } else if ($location.path() === "/admin/login" && AuthService.isLoggedIn()) {
                // skip login page if already logged in
                $location.path('/admin/vocabularies');
            }
        });
        //}

    });

});
