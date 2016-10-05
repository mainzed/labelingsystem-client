'use strict';

describe("Component: vocabs", function() {

    // elements
    var vocabs = element.all(by.css("ls-vocab-box"));
    var metaDialog = element(by.css("div.ngdialog.bigdialog"));
    var showMoreButton = vocabs.first().element(by.css("span.icon-more.icon"));

    beforeAll(function() {
        browser.get(browser.baseUrl + "#/admin/login");
        element(by.model("username")).sendKeys("test");
        element(by.model("password")).sendKeys("test");
        element(by.css('button.deletebutton')).click();

        // wait until login redirect complete
        browser.wait(function() {
            return browser.getCurrentUrl().then(function(url) {
                return url === browser.baseUrl + "#/admin/vocabularies"; // wait until true
            });
        });
    });

    afterEach(function() {
        // go back in case of redirect
        browser.get(browser.baseUrl + "#/admin/vocabularies");
    });

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
        expect(vocabs.count()).toBe(3);
    });

    describe("Vocabulary boxes", function() {

        it("should show vocab properties", function() {
            var boxTitle = vocabs.first().element(by.css("span.vocabname"));
            expect(boxTitle.getText()).toEqual("Beispiel Vokabular 1");

            var conceptNumber = vocabs.first().element(by.css("span.vocabsize"));
            expect(conceptNumber.getText()).toEqual("3 concepts");

            var language = vocabs.first().element(by.css("span.language"));
            expect(language.getText()).toEqual("DE");

            var description = vocabs.first().element(by.css("span.note"));
            expect(description.getText()).toEqual("Beispiel Vokabular Eins");

        });

        it("should have a working metadata button", function() {
            expect(showMoreButton.isDisplayed()).toBeTruthy();

            // dialog should not exist prior to click
            expect(metaDialog.isPresent()).toBeFalsy();

            // should show dialog after click
            showMoreButton.click();
            expect(metaDialog.isDisplayed()).toBeTruthy();
            expect(metaDialog.element(by.css(".dialogheader h3")).getText()).toEqual("Beispiel Vokabular 1");
        });

        it("should open the concepts view when clicked", function() {
            vocabs.first().element(by.css("div.box.vocabulary")).click();
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '#/admin/vocabularies/2420a664-7b1c-4da6-aba3-d0694221ee8a/concepts');
        });

    });

    it("should filter vocab boxes", function() {
        // vocabs before filter input
        expect(vocabs.count()).toEqual(3);

        var filter = element(by.model("vocabFilter"));
        filter.sendKeys("Vokabular 1");
        expect(vocabs.count()).toEqual(1);
    });

    it("should have working 'create vocab' button", function() {
        // button is visible
        var createButton = element(by.css("span.plusposition"));
        expect(createButton.isPresent()).toBeTruthy();

        // TODO: test if dialog opens and create new vocab
        //var dialog = element(by.css(".ngdialog.bigdialog"));

        // dialog not visible prior to click
        //expect(metaDialog.isPresent()).toBeFalsy();

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
