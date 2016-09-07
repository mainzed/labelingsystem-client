'use strict';

describe('Service: thesauriService', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var thesauriService;
  beforeEach(inject(function (_thesauriService_) {
    thesauriService = _thesauriService_;
  }));

  it('should do something', function () {
    expect(!!thesauriService).toBe(true);
  });

});
