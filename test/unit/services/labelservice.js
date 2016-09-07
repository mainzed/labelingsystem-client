'use strict';

describe('Service: LabelService', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var LabelService;
  beforeEach(inject(function (_LabelService_) {
    LabelService = _LabelService_;
  }));

  it('should do something', function () {
    expect(!!LabelService).toBe(true);
  });

});
