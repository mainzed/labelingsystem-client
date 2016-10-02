'use strict';

describe("Component: vocabs", function() {

    beforeAll(function() {
        browser.get(browser.baseUrl + "#/admin/login");
        element(by.model("username")).sendKeys("demo");
        element(by.model("password")).sendKeys("demo");
        element(by.css('button.deletebutton')).click();

        // TODO: create new user "test" and create the tested vocab!
    });

    afterEach(function() {
        // go back in case of redirect
        browser.get(browser.baseUrl + "#/admin/vocabularies");
    });
    // beforeEach(function() {
    //     browser.get(browser.baseUrl + "#/admin/vocabularies");
    // });
    //
    // afterAll(function() {
    //     browser.manage().deleteAllCookies();
    // });

    it("should be on correct url path", function() {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '#/admin/vocabularies');
    });

    it("should have header", function() {
        var header = element(by.id("header"));
        expect(header).toBeTruthy();

        var headerText = header.element(by.css("h1")).getText();
        expect(headerText).toEqual("My vocabularies");
    });

    it("should show vocabularies", function() {
        element.all(by.repeater('vocab in vocabularies')).then(function(vocabs) {
            expect(vocabs.length).toEqual(23);
        });
    });

    describe("Vocabulary boxes", function() {
        var vocabs;
        beforeEach(function() {
            vocabs = element.all(by.repeater('vocab in vocabularies'));
            //var elements = element.all(by.repeater('term in facets.target'));
        });

        it("should show vocab properties", function() {
            var boxTitle = vocabs.first().element(by.css("span.vocabname"));
            expect(boxTitle.getText()).toEqual("123456!");

            var conceptNumber = vocabs.first().element(by.css("span.vocabsize"));
            expect(conceptNumber.getText()).toEqual("3 concepts");

            var language = vocabs.first().element(by.css("span.language"));
            expect(language.getText()).toEqual("ES");

            var description = vocabs.first().element(by.css("span.note"));
            expect(description.getText()).toEqual("123456");

        });

        it("should have a working metadata button", function() {
            var showMore = vocabs.first().element(by.css("span.icon-more.icon"));
            expect(showMore.isDisplayed()).toBeTruthy();

            // dialog not visible
            var dialog = element(by.css("div.dialogwrapper"));
            expect(dialog.isDisplayed()).toBeFalsy();

            showMore.click();
            expect(dialog.isDisplayed()).toBeTruthy();
        });

        it("should open the concepts view when clicked", function() {
            vocabs.first().element(by.css("div.box.vocabulary")).click();
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '#/admin/vocabularies/8d400769-fbd6-464c-8dc6-860709419801/concepts');
        });


    });

    it("should filter vocab boxes", function() {
        // vocabs before filter input
        element.all(by.repeater('vocab in vocabularies')).then(function(vocabs) {
            expect(vocabs.length).toEqual(23);
        });

        var filter = element(by.model("vocabFilter"));
        filter.sendKeys("123");
        element.all(by.repeater('vocab in vocabularies')).then(function(vocabs) {
            expect(vocabs.length).toBeLessThan(23);
        });
    });

    it("should have working 'create vocab' button", function() {
        // button is visible
        var createButton = element(by.css("span.plusposition"));
        expect(createButton.isPresent()).toBeTruthy();

        // TODO: test if dialog opens and create new vocab
        //var dialog = element(by.css(".ngdialog.bigdialog"));

        // dialog not visible prior to click
        //expect(dialog.isPresent()).toBeFalsy();

        // click on button opens dialog
        //createButton.click();
        //expect(dialog.isPresent()).toBeTruthy();

    });

    describe("Footer", function() {
        it("should have footer", function() {
            var footer = element(by.id("footer"));
            expect(footer).toBeTruthy();
        });

        it("should have a working logout button", function() {
            // is visible
            var logoutButton = element(by.css("span.logout"));
            expect(logoutButton.isPresent()).toBeTruthy();
            expect(logoutButton.getText()).toEqual("Logout");

            // should redirect to login page on logout click
            element(by.css("span.logout")).click();
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + "#/admin/login");
        });

    });

});
