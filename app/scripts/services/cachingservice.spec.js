'use strict';

describe('Service: CachingService', function () {

    // load the service's module
    beforeEach(module('labelsApp'));

    // instantiate service
    var CachingService;
    beforeEach(inject(function (_CachingService_) {
        CachingService = _CachingService_;
    }));

    it('should do something', function () {
        expect(!!CachingService).toBe(true);
    });

    it("should have editor and viewer properties", function() {
        expect(CachingService.hasOwnProperty("editor")).toBeTruthy();
        expect(CachingService.hasOwnProperty("viewer")).toBeTruthy();
    });

    it("getFilterByVocab() should be defined", function() {
        expect(CachingService.getFilterByVocab).toBeDefined();
        expect(typeof CachingService.getFilterByVocab).toBe("function");
    });

    it("getFilterByVocab() should return filter value if one exists for provided vocabID", function() {

        CachingService.filters.concepts = {
            vocabID: "123",
            value: "some filter value"
        };

        var filterValue = CachingService.getFilterByVocab("123");
        expect(filterValue).toEqual("some filter value");
    });

    it("getFilterByVocab() should return undefined if different vocabID or nothing in cache", function() {

        // different vocabID
        CachingService.filters.concepts = {
            vocabID: "1234",
            value: "some filter value"
        };
        expect(CachingService.getFilterByVocab("123")).toBeUndefined();

        // empty cache
        CachingService.filters.concepts = null;
        expect(CachingService.getFilterByVocab("123")).toBeUndefined();
    });
     //yourFunctionName == 'function'

    // it("should provide scores property", function() {
    //     expect(ConfigService.hasOwnProperty("scores")).toBe(true);
    //     expect(ConfigService.scores.constructor).toBe(Object);
    // });

});
