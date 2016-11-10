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

    it("should provide config properties", function() {
        expect(ConfigService.hasOwnProperty("version")).toBe(true);
        expect(ConfigService.hasOwnProperty("host")).toBe(true);
        expect(ConfigService.hasOwnProperty("api")).toBe(true);
        expect(ConfigService.hasOwnProperty("showMatches")).toBe(true);
    });

    it("should provide scores property", function() {
        expect(ConfigService.hasOwnProperty("scores")).toBe(true);
        expect(ConfigService.scores.constructor).toBe(Object);
    });

});
