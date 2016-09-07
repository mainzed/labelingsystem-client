'use strict';

describe('Service: externalResourcesService', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var externalResourcesService;
  beforeEach(inject(function (_externalResourcesService_) {
    externalResourcesService = _externalResourcesService_;
  }));

  it('should do something', function () {
    expect(!!externalResourcesService).toBe(true);
  });

});
