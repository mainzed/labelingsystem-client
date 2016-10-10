"use strict";

describe('Component: lsVocabBox', function () {

    beforeEach(module('labelsApp'));

    var element;
    var scope;

    beforeEach(angular.mock.module('ngMockE2E'));

    //var controller;
    beforeEach(inject(function($rootScope, $compile){
        scope = $rootScope.$new();
        element = angular.element('<ls-vocab-box data="{{vocab}}"></ls-vocab-box>');
        element = $compile(element)(scope);
        scope.vocab = {
            id: "123",
            title: "Vocab Title",
            description: "Vocab Description"
        };
        scope.$apply();
    }));



    // it('should render the text', function() {
    //     var h1 = element.find('h1');
    //     expect(h1.text()).toBe('Unit Testing AngularJS 1.5');
    // });
    //
    //
    // it("should render vocab title", function() {
    //     var title = element.find("span.vocabname");
    //     expect(title.text()).toBe("hello");
    // });
    //
    // it("should show username", function() {
    //     var username = element.find(":nth-child(2)");
    //     expect(username.length).toBeTruthy();
    // });
});
