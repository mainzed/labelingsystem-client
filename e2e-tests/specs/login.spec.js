'use strict';

describe("Component: login", function() {

    beforeEach(function() {
        browser.get(browser.baseUrl + "#/admin/login");
        //browser.waitForAngular();
        //browser.ignoreSynchronization = true;
        //browser.waitForAngular();
        //browser.sleep(500);

        //browser.driver.get(browser.baseUrl + "#/admin/login");
    });

    it("should have a title", function() {
        expect(browser.getTitle()).toEqual('Labeling System');
    });

    // it("should have the login panel", function() {
    //     var panel = element(by.css('.center'));
    //     //expect(panel.isPresent()).toBeFalsy();
    //
    //
    //     //console.log(element(by.css(".center h3")).getText());
    //     //expect(element(by.css(".center h3")).getText()).toEqual("123123123");
    //     //panel
    //
    //     // expect(panelTitle).toEqual("Labeling System Editor");
    // });

    it("should unlock login button when user/pw entered", function() {
        var button = element(by.css('.deletebutton'));

        expect(button.getAttribute("class")).toContain("inactive");

        // providing username and password should remove class 'inactive'
        element(by.model("username")).sendKeys("John Doe");
        element(by.model("password")).sendKeys("some password");

        expect(button.getAttribute('class')).not.toContain("inactive");
    });

});
