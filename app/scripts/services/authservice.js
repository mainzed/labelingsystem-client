'use strict';

/**
 * @ngdoc service
 * @name labelsApp.AuthService
 * @description
 * # AuthService
 * Service in the labelsApp.
 */
angular.module('labelsApp')
  .service('AuthService', function ($location, $q, $cookies, $http, $httpParamSerializerJQLike, ConfigService) {

    var user = null;

    this.isLoggedIn = function() {
        if (user) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Gets on every route change and checs if user is logged in on server.
     * Always resolves. this is async so the user object is set to use with
     * other functions.
     */
    this.getUserStatus = function() {
        var deferred = $q.defer();
        // get username and token from cookie. if it doesnt exist, request
        // will fail anyway
        var cookie = $cookies.getObject("lsCookie");

        if (cookie) {
            console.log(cookie);
            $http.get(ConfigService.host + "/auth/status?user=" + cookie.username + "&token=" + cookie.token)
            // handle success
            .success(function (data) {
                console.log(data);
                if (data.varified){
                  user = true;
                } else {
                  user = false;
                  $cookies.remove("lsCookie");
                }
                deferred.resolve();
            })
            .error(function (res) {
                console.log(res);
                user = false;
                $cookies.remove("lsCookie");
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;

    };

    this.login = function(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post(ConfigService.host + "/auth/login", $httpParamSerializerJQLike({ "user": username, "pwd": password }))
        .success(function(data, status) {
            // TODO Florian: dont return expection when login failed, but meaningful error message
            if (status === 200 && data) {
                user = true;
                // set cookie to remember username and token
                $cookies.putObject("lsCookie", {
                    "username": username,
                    "token": "my-super-secret-token"
                });
                deferred.resolve();
            } else {
                user = false;
                deferred.reject();
            }
        })
        .error(function(res) {
            console.log("error");
            user = false;
            deferred.reject(res.errors);
        });

        // return promise object
        return deferred.promise;

    };

    this.logout = function() {

        var deferred = $q.defer();

        $http.post(ConfigService.host + "/auth/logout?user=demo")
        .success(function () {
            user = false;  // remove user in any case
            deferred.resolve();
        })
        .error(function () {
            user = false;  // remove user in any case
            deferred.reject();
        });

      // return promise object
      return deferred.promise;
    };

});
