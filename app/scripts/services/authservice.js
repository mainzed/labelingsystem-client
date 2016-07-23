'use strict';

/**
 * @ngdoc service
 * @name labelsApp.AuthService
 * @description
 * # AuthService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('AuthService', function ($location, $cookies) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var user = {};

    this.login = function(username, password, success, failure) {
        // TODO: validate username/password
        if (username && password) {
            user.name = username;

            $cookies.put('labelsUser', username);

            success();
        } else {
            failure("username or password missing!");
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
        }
    };

  });
