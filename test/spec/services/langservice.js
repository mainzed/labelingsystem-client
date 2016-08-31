'use strict';

describe('Service: langService', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var langService;
  beforeEach(inject(function (_langService_) {
    langService = _langService_;
  }));

  it('should do something', function () {
    expect(!!langService).toBe(true);
  });

});
