'use strict';

describe('Service: waybackService', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var waybackService;
  beforeEach(inject(function (_waybackService_) {
    waybackService = _waybackService_;
  }));

  it('should do something', function () {
    expect(!!waybackService).toBe(true);
  });

});
