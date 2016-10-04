"use strict";
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
        concepts: 'specs/concepts.spec.js'
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
  //   onPrepare: function() {
  //       browser.driver.get(env.baseUrl + '#/admin/login');
  //
  //   browser.driver.findElement(by.model('username')).sendKeys('demo');
  //   browser.driver.findElement(by.model('password')).sendKeys('demo');
  //   browser.driver.findElement(by.css('button.deletebutton')).click();
  //
  //   // Login takes some time, so wait until it's done.
  //   // For the test app's login, we know it's done when it redirects to
  //   // index.html.
  //   return browser.driver.wait(function() {
  //     return browser.driver.getCurrentUrl().then(function(url) {
  //       return /index/.test(url);
  //     });
  //   }, 10000);
  // }

};
