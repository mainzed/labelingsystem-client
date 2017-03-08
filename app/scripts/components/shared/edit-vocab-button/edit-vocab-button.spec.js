"use strict";

describe('Component: lsEditVocabButton', function () {

    beforeEach(module('labelsApp'));

    var element;
    var scope;
    var controller;

    var $httpBackend;

    // reference all services used in tests
    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    beforeEach(inject(function($httpBackend) {
        $httpBackend.when('GET', ConfigService.host + '/api/v1/vocabs?creatorInfo=true').respond(200, JSON.stringify([
            // mocked vocabs
            { id: "vocab1", title: "Vocabulary 1", creator: { id: "user1"} },
            { id: "vocab2", title: "Vocabulary 2", creator: { id: "user2"} },
            { id: "vocab3", title: "Vocabulary 3", creator: { id: "user3"} }
        ]));
    }));

    afterEach(inject(function($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    beforeEach(inject(function($rootScope, $compile){
        scope = $rootScope.$new();
        element = angular.element('<ls-edit-vocab-button data="vocab"></ls-edit-vocab-button>');
        controller = element.controller;
        element = $compile(element)(scope);

        // mock vocab object
        scope.vocab = {
            id: "123",
            title: "Vocab Title",
            description: "Vocab Description",
            getEnrichmentVocab: function(callback) {
                return callback("123");
            },
            getThesauri: function(callback) {
                return callback([{
                    default: true,
                    name: "this.123",
                    description: "this vocabulary"
                }]);
            }
        };

        scope.$apply();
        $httpBackend.flush();
    }));

    // it("should render button", function() {
    //     var icon = element.find("span.icon-more");
    //     expect(icon.length).toBeTruthy();
    // });

    // it("should call openDialog() on click", function() {
    //     element.find("span.icon-more").click();
    //     // spyOn(scope, 'openDialog');
    //     //
    //     // // Run stuff to trigger doSomething()
    //     //
    //     // expect(scope.openDialog).toHaveBeenCalled();
    //     expect(controller.data).toBe("123");
    // });
    // it("should open dialog", function() {
    //     var icon = element.find("span.icon-more");
    //     icon.click();
    // });


});
