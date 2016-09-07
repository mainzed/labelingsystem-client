exports.config = {
    // location of the Selenium JAR file and chromedriver, use these if you installed protractor locally
    //seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.40.0.jar',
    //chromeDriver: '../node_modules/protractor/selenium/chromedriver',

    // location of your E2E test specs
    specs: [
        'e2e/**/*.spec.js'
    ],

    // or configure a single browser

    capabilities: {
        'browserName': 'chrome'
        //'browserName': 'phantomjs'
    },

    // The address of a running selenium server. (if started manually)
    // use: ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager start
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

    // url where your app is running, relative URLs are prepending with this URL
    baseUrl: 'http://localhost:9001/',

    // testing framework, jasmine is the default
    framework: 'jasmine'
};
