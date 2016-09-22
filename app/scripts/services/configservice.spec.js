'use strict';

describe('Service: ConfigService', function () {

    // load the service's module
    beforeEach(module('labelsApp'));

    // instantiate service
    var ConfigService;
    beforeEach(inject(function (_ConfigService_) {
        ConfigService = _ConfigService_;
    }));

    it('should do something', function () {
        expect(!!ConfigService).toBe(true);
    });

    it("should provide host property", function() {
        expect(ConfigService.hasOwnProperty("host")).toBe(true);
        expect(typeof(ConfigService.host)).toBe("string");
    });

    it("should provide preventThumbnailEdit property", function() {
        expect(ConfigService.hasOwnProperty("preventThumbnailEdit")).toBe(true);
        expect(typeof(ConfigService.preventThumbnailEdit)).toBe("boolean");
    });

    it("should provide showMatches property", function() {
        expect(ConfigService.hasOwnProperty("showMatches")).toBe(true);
        expect(typeof(ConfigService.showMatches)).toBe("boolean");
    });

    it("should provide scores property", function() {
        expect(ConfigService.hasOwnProperty("scores")).toBe(true);
        expect(ConfigService.scores.constructor).toBe(Object);
    });

    it("should provide languages property", function() {
        expect(ConfigService.hasOwnProperty("languages")).toBe(true);
        expect(ConfigService.languages.constructor).toBe(Array);
    });

});
