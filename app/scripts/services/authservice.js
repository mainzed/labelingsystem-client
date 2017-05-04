"use strict";

/**
 * @ngdoc service
 * @name labelsApp.AuthService
 * @description
 * # AuthService
 * Service in the labelsApp.
 */
angular.module("labelsApp")
.service("AuthService", function($rootScope, $interval, $location, $q, $cookies, $http, $httpParamSerializerJQLike, ConfigService) {
    var user = null;

    this.isLoggedIn = function() {
        return user ? true : false;
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
            $http.get(ConfigService.api + "/auth/status?user=" + cookie.userID + "&token=" + cookie.token)
            // handle success
            .success(function(data) {
                if (data.status.verified) {
                    user = data.user;  // update user object with response user object
                    user.role = data.status.role;
                    $rootScope.isAuthenticated = true;
                } else {
                    user = false;
                    $cookies.remove("lsCookie");
                    $rootScope.isAuthenticated = false;
                }
                deferred.resolve();
            })
            .error(function() {
                user = false;
                $cookies.remove("lsCookie");
                $rootScope.isAuthenticated = false;
                deferred.resolve();
            });
        } else {
            $rootScope.isAuthenticated = false;
            deferred.resolve();
        }
        return deferred.promise;
    };

    this.login = function(username, password) {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post(ConfigService.api + "/auth/login", $httpParamSerializerJQLike({ "user": username, "pwd": password }))
        .success(function(data, status) {
            // TODO Florian: dont return expection when login failed, but meaningful error message
            if (status === 200 && data) {
                user = data.user;
                user.role = data.status.role;

                // set cookie to remember username and token
                $cookies.remove("lsCookie");
                $cookies.putObject("lsCookie", {
                    "userID": data.user.id,
                    "token": data.status.token,
                    "role": data.status.role,
                    "userName": data.user.firstName + " " + data.user.lastName
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

        $http.post(ConfigService.api + "/auth/logout?user=" + user.id)
        .success(function() {
            user = false;  // remove user in any case
            $cookies.remove("lsCookie");
            deferred.resolve();
        })
        .error(function() {
            user = false;  // remove user in any case
            $cookies.remove("lsCookie");
            deferred.reject();
        });

        // return promise object
        return deferred.promise;
    };

    /**
     * Returns the user object.
     */
    this.getUser = function() {
        return user;
    };

    /**
     * @param {Object} user
     *  */
    this.updateUser = function(user) {
        $http.put(ConfigService.api + "/agents/" + user.id, user).then(function(res) {
            if (res.data.id === user.id && res.status === 201) {
                user = user.data;
            }
        }, function error(res) {
            console.log(res);
        });
    };
});
