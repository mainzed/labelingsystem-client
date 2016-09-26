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

        // sets user object before everything else so that isLoggedIn is synchronous
        AuthService.getUserStatus().then(function() {
            if (next.access.restricted && !AuthService.isLoggedIn()){
                $location.path('/admin/login');
                $route.reload();
            }
        });
    });

});
