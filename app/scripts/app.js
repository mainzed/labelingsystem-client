"use strict";

/**
 * @ngdoc overview
 * @name labelsApp
 * @description
 * # labelsApp
 * Some description here!
 * Main module of the application.
 */
angular
  .module("labelsApp", [
      "ngAnimate",
      "ngCookies",
      "ngResource",
      "ngRoute",
      "ngSanitize",
      "ngTouch",
      "ngDialog"
  ])
  .config(function($routeProvider,$locationProvider) {
  //.config(function($routeProvider) {
      // http://stackoverflow.com/questions/41214312/exclamation-mark-after-hash-in-angularjs-app
      $locationProvider.hashPrefix('');
      $routeProvider

      // viewer
      .when("/", {
          template: "<ls-landing></ls-landing>",
          access: {restricted: false}
      })
      .when("/search", {
          template: "<ls-search-results></ls-search-results>",
          access: {restricted: false}
      })
      .when("/faq", {
          template: "<ls-faq></ls-faq>",
          access: {restricted: false}
      })
      .when("/vocabularies", {
          template: "<ls-vocabs mode='viewer'></ls-vocabs>",
          access: {restricted: false}
      })
      .when("/vocabularies/:vID/concepts", {
          template: "<ls-concepts mode='viewer'></ls-concepts>",
          access: {restricted: false}
      })
      .when("/vocabularies/:vID/concepts/:lID", {
          template: "<ls-concept-detail mode='viewer'></ls-concept-detail>",
          access: {restricted: false}
      })

      // editor
      .when("/editor", {
          redirectTo: "/editor/login"
      })
      .when("/editor/login", {
          template: "<ls-login></ls-login>",
          access: {restricted: false}
      })
      .when("/editor/vocabularies", {
          template: "<ls-vocabs mode='editor'></ls-vocabs>",
          access: {restricted: true}
      })
      .when("/editor/vocabularies/:vID/concepts", {
          template: "<ls-concepts mode='editor'></ls-concepts>",
          access: {restricted: true}
      })
      .when("/editor/vocabularies/:vID/concepts/:lID", {
          template: "<ls-concept-detail mode='editor'></ls-concept-detail>",
          access: {restricted: true}
      })
      .when("/editor/vocabularies/:vID", {
          redirectTo: "/editor/vocabularies/:vID/concepts"
      })
      .otherwise({
          redirectTo: "/"
      });
  });

// global events
angular.module("labelsApp").run(function($rootScope, $location, $route, AuthService, HelperService) {
    // do this before a route is changed
    // to prevent this for public routes use "access: {restricted: true}"
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        AuthService.getUserStatus().then(function() {
            if (next.access && next.access.restricted && !AuthService.isLoggedIn()) {
                $location.path("/editor/login");
                $route.reload();

            } else if ($location.path() === "/editor/login" && AuthService.isLoggedIn()) {
                // skip login page if already logged in
                $location.path("/editor/vocabularies");
            }
        });
    });

    // init nanoscroller when dialog is opened
    $rootScope.$on("ngDialog.opened", function(e, $dialog) {
        HelperService.refreshNanoScroller();
    });
});
