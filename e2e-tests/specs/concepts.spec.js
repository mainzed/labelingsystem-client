'use strict';

describe("Component: concepts", function() {
    var username = "test";
    var password = "test";
    var vocab = {
        id: "2420a664-7b1c-4da6-aba3-d0694221ee8a",
        title: "Beispiel Vokabular 1",
        language: "de"
    };

    // elements
    var header = element(by.id("header"));
    var breadcrumbs = element(by.id("breadcrumb"));
    var concepts = element.all(by.css("ls-list-box"));
    var createButton = element(by.css("span.plusposition"));
    var createDialog = element(by.css("div.ngdialog"));

    // create concept dialog
    var title = element(by.model("newVocab.title"));
    var description = element(by.model("newVocab.description"));
    var applyButton = element(by.css("div.apply"));

    beforeAll(function() {
        browser.get(browser.baseUrl + "#/admin/login");
        element(by.model("username")).sendKeys(username);
        element(by.model("password")).sendKeys(password);
        element(by.css('button.deletebutton')).click();

        // wait until login redirect complete
        browser.wait(function() {
            return browser.getCurrentUrl().then(function(url) {
                return url === browser.baseUrl + "#/admin/vocabularies"; // wait until true
            });
        });

        // navigate to concepts page
        browser.get(browser.baseUrl + "#/admin/vocabularies/" + vocab.id + "/concepts");

    });

    afterEach(function() {
        // go back in case of redirect
        browser.get(browser.baseUrl + "#/admin/vocabularies/" + vocab.id + "/concepts");
    });

    it("should be on correct url path", function() {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + "#/admin/vocabularies/" + vocab.id + "/concepts");
    });

    it("should have header", function() {
        expect(header.isDisplayed()).toBeTruthy();

        // breadcrumbs
        var text = breadcrumbs.element(by.css("span a.outside")).getText();
        expect(text).toEqual("My vocabularies");

        // vocab title
        var headerText = header.element(by.css("h1")).getText();
        expect(headerText).toEqual(vocab.title);

        // vocab language
        //expect(header.element(by.css("span.language"))).toEqual("es");
    });

    it("should show concepts", function() {
        expect(concepts.first().isDisplayed()).toBeTruthy();
        expect(concepts.count()).toBe(3);
    });

    it("should filter concepts", function() {
        // vocabs before filter input
        expect(concepts.count()).toEqual(3);

        var filter = element(by.model("labelFilter"));
        filter.sendKeys("bv1");
        expect(concepts.count()).toBeLessThan(3);
    });

    it("should show concept details", function() {
        // should have a label
        var thumbnail = concepts.first().element(by.css("span.thumbnail"));
        expect(thumbnail.getText()).toBeTruthy();  // TODO: should show label

        // should have date
        var date = concepts.first().element(by.css("span.bigboxdate"));
        expect(date.getText()).toEqual("04.10.2016");
    });

    it("should show mini preview with content", function() {
        var miniPreview = concepts.first().element(by.css("mini-preview"));
        expect(miniPreview.isDisplayed()).toBeTruthy();

        // TODO: should have miniboxes
    });

    it("should open dialog on create", function() {
        // dialog not visible
        expect(createDialog.isPresent()).toBeFalsy();

        // click on button should open dialog
        createButton.click();
        expect(createDialog.isDisplayed()).toBeTruthy();

        // apply button should be disabled, but inactive
        expect(applyButton.isDisplayed());
        expect(applyButton.getAttribute("class")).toContain("inactive");
    });

    it("should create new concept", function() {
        expect(concepts.count()).toBe(3);
        // open dialog
        createButton.click();

        // create concept
        element(by.model("$ctrl.newConcept.thumbnail")).sendKeys("new concept");
        applyButton.click();

        // check if new concept was added
        expect(concepts.count()).toBe(4);
    });





});
