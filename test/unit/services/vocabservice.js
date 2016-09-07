'use strict';

describe('Service: VocabService', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var VocabService;
  beforeEach(inject(function (_VocabService_) {
    VocabService = _VocabService_;
  }));

  it('should do something', function () {
    expect(!!VocabService).toBe(true);
  });

});
