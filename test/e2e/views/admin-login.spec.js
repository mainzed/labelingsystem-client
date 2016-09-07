'use strict';

describe("View: admin login", function() {

    beforeEach(function() {
        browser.get(browser.baseUrl + "#/admin/login"); // go to current view
    });

    it("should show correct title", function() {
        expect(browser.getTitle()).toBe("Labeling System Webapp");
    });

});
