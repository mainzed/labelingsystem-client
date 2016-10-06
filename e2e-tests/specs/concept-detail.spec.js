'use strict';

describe("Component: concept-detail", function() {

    // elements
    var header = element(by.id("header"));
    //var breadcrumbs = element(by.id("breadcrumb"));
    var metaButton = element(by.css("span.icon-more.icon"));
    var metaDialog = element(by.css("div.ngdialog.bigdialog"));
    var descriptionBox = element(by.css("ls-description-box div.box"));
    var searchField = element(by.model("searchValue"));
    var searchResults = element.all(by.css("ls-search-result-box"));
    var vocabResults = element.all(by.css("ls-vocab-result-box"));
    var searchTab = element.all(by.css("div.tab")).get(0);
    var vocabTab = element.all(by.css("div.tab")).get(1);

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

        // navigate to concept-detail page
        browser.get(browser.baseUrl + "#/admin/vocabularies/2420a664-7b1c-4da6-aba3-d0694221ee8a/concepts/ac32bf8b-a9d1-47a7-9c21-0943f171fdd8");

    });

    afterEach(function() {
        // go back in case of redirect
        browser.get(browser.baseUrl + "#/admin/vocabularies/2420a664-7b1c-4da6-aba3-d0694221ee8a/concepts/ac32bf8b-a9d1-47a7-9c21-0943f171fdd8");
    });

    it("should be on correct url path", function() {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + "#/admin/vocabularies/2420a664-7b1c-4da6-aba3-d0694221ee8a/concepts/ac32bf8b-a9d1-47a7-9c21-0943f171fdd8");
    });

    it("should have header", function() {
        expect(header.isDisplayed()).toBeTruthy();

        // breadcrumbs
        //expect(element(by.css("span a.outside")).getText()).toEqual("My vocabularies");

        // concept label
        var label = header.element(by.css("h1"));
        expect(label.getText()).toEqual("Concept BV1");

        // concept language
        expect(element(by.css("span.language")).getText()).toEqual("DE");

        // metadata button
        expect(metaButton.isDisplayed()).toBeTruthy();

    });

    it("should open concept metadata on click", function() {
        expect(metaDialog.isPresent()).toBeFalsy();

        metaButton.click();
        expect(metaDialog.isPresent() && metaDialog.isDisplayed()).toBeTruthy();
        expect(metaDialog.element(by.css("h3")).getText()).toEqual("Concept BV1");
    });

    it("should show description box", function() {
        expect(descriptionBox.isDisplayed()).toBeTruthy();
        expect(descriptionBox.element(by.css("span.thumbnail")).getText()).toEqual("Concept BV Eins");
    });

    it("should open description dialog", function() {
        var dialog = element(by.css(".ngdialog.bigdialog"));

        // dialog should not be visible
        expect(dialog.isPresent()).toBeFalsy();

        descriptionBox.click();
        // should be visible after click
        expect(dialog.isPresent() && dialog.isDisplayed()).toBeTruthy();
        expect(dialog.element(by.css("h3")).getText()).toEqual("Description");
    });

    it("should show translations");

    it("should show broader boxes");

    it("should show narrower boxex");


    describe("Enrichment browser: ", function() {

        it("should show enrichment buttons");

        // it("should show prefilled search tab", function() {
        //     expect(searchField.isDisplayed()).toBeTruthy();
        //     expect(searchField.getAttribute("value")).toEqual("Concept BV1");
        // });

        // it("should show search results", function() {
        //     expect(searchResults.count()).toBeGreaterThan(0);
        //     //expect(searchResults.first().element(by.css("div span.thumbnail")).getText()).toEqual("Regionalist (American Scene)");
        // });

        it("should show siblings on open", function() {
            // should be inactive before click
            //expect(vocabTab.getAttribute("class")).not.toContain("active");

            // should be active when tab is clicked
            //vocabTab.click();
            expect(vocabTab.getAttribute("class")).toContain("active");

            // should show two siblings
            expect(vocabResults.count()).toEqual(2);
        });


    });




});
