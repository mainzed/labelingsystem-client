'use strict';

describe('Service: retcatService', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var retcatService;
  beforeEach(inject(function (_retcatService_) {
    retcatService = _retcatService_;
  }));

  it('should do something', function () {
    expect(!!retcatService).toBe(true);
  });

});
