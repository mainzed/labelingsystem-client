'use strict';

/**
 * @ngdoc service
 * @name labelsApp.AuthService
 * @description
 * # AuthService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('AuthService', function ($location, $cookies, $http, $httpParamSerializerJQLike, ConfigService) {
    var user = {};

    // set inital user object
    if ($cookies.getObject("lsCookie")) {
        user.name = $cookies.getObject("lsCookie").name;
        // get additonal infos

        // role
    }

    /**
     * Login using the labeling system /auth api
     */
    this.login = function(username, password, successCallback, errorCallback) {

        var data = {
            "user": username,
            "pwd": password
        };
        $http.post(ConfigService.host + "/auth/login", $httpParamSerializerJQLike(data)).then(function() {

            user.name = username;  // only used for config like "role" etc
            $cookies.putObject("lsCookie", {
                "username": username,
                "secret": "my-super-secret-token"  // TODO: store custom access token in cookie
            });
            successCallback();

        }, function(err) {
            console.log("login failed");
            this.logout();
            errorCallback(err);
        });
    };

    this.logout = function() {
        user = {};
        $cookies.remove("lsCookie");
        $location.path('/admin/login');
    };

    this.getUser = function() {
        return {
            name: "demo"
        };
        //return user;
    };

    this.isLoggedIn = function() {
        var cookie = $cookies.getObject("lsCookie");

        if (cookie) {  // TODO: check token on server

            //console.log(cookie.username);
            //console.log(cookie.secret);

            user.name = cookie.username;
            // get userinfo
            //this.getUserInfo();
            return true;
        } else {
            // no cookie, not logged in
            return false;
        }
    };

  });
