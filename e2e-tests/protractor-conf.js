"use strict";

var http = require('http');

exports.config = {
    // location of the Selenium JAR file and chromedriver, use these if you installed protractor locally
    //seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.40.0.jar',
    //chromeDriver: '../node_modules/protractor/selenium/chromedriver',

    // testing framework, jasmine is the default
    framework: 'jasmine2',

    // location of your E2E test specs
    specs: [
        'specs/**/*.spec.js'
    ],

    suites: {
        login: 'specs/login.spec.js',
        vocabs: 'specs/vocabs.spec.js',
        concepts: 'specs/concepts.spec.js',
        "concept-detail": 'specs/concept-detail.spec.js'
    },

    capabilities: {
        'browserName': 'chrome'
        //'browserName': 'phantomjs'
    },

    // multiCapabilities: [
    //     {
    //         'browserName': 'firefox'
    //     },{
    //         'browserName': 'chrome'
    //     }
    // ],

    // The address of a running selenium server. (if started manually)
    // use: ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager start
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

    // url where your app is running, via grunt serve
    // use grunt task to start different server so I dont have to use
    // the working one on grunt serve
    baseUrl: 'http://localhost:9000/',

    jasmineNodeOpts: {
        isVerbose: false,
        showColors: true
        //includeStackTrace: true,
        //defaultTimeoutInterval: 10000000000
    },

    // login before tests
    onPrepare: function() {

        // var defer = protractor.promise.defer();
        //
        // http.request({host: 'http://143.93.114.135', path: '/api/v1/tests/init', method: 'POST'}, function(res) {
        //     defer.fulfill(res);
        // });
        //
        // return defer.promise;
    }

};
