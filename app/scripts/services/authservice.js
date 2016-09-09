'use strict';

/**
 * @ngdoc service
 * @name labelsApp.AuthService
 * @description
 * # AuthService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('AuthService', function ($location, $cookies, $http, ConfigService) {
    var user = {};

    /**
     * Login using the labeling system /auth api
     */
    this.login = function(username, password, successCallback, errorCallback) {

        // $http.post(ConfigService.host + "/auth/status" + "user=demo&pwd=demo",).then(function(res) {
        //     console.log(res);
        // });

        // TODO: validate username/password
        if (username && password) {
            user.name = username;

            $cookies.put('labelsUser', username);

            successCallback();
        } else {
            errorCallback("username or password missing!");
        }
    };

    this.logout = function() {
        user = {};
        $cookies.put('labelsUser', undefined);
        $location.path('/admin/login');
    };

    this.getUser = function() {
        var userCookie = $cookies.get("labelsUser");
        if (userCookie) {
            user.name = userCookie;
            return user;
        } else {
            return false;
        }
    };

    this.isLoggedIn = function() {
        if ($cookies.get("labelsUser")) {
            return true;
        } else {
            return false;
        }
    };

  });
