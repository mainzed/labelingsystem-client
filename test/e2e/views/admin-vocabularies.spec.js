'use strict';

describe("View: admin vocabularies", function() {

    beforeEach(function() {
        //console.log(browser.baseUrl);
        browser.ignoreSynchronization = true;
        browser.waitForAngular();
        browser.sleep(500);

        browser.get(browser.baseUrl + "#/admin/vocabularies"); // go to current view
    });

    it("should show correct title", function() {
        expect(browser.getTitle()).toBe("Labeling System Webapp");
    });

    it("should redirect to login page", function() {
        expect(browser.getCurrentUrl()).toBe("123");
    });

    //

});
