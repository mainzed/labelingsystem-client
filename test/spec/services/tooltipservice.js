'use strict';

describe('Service: TooltipService', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var TooltipService;
  beforeEach(inject(function (_TooltipService_) {
    TooltipService = _TooltipService_;
  }));

  it('should do something', function () {
    expect(!!TooltipService).toBe(true);
  });

});
