'use strict';

describe('Service: miniPreview', function () {

  // load the service's module
  beforeEach(module('labelsApp'));

  // instantiate service
  var miniPreview;
  beforeEach(inject(function (_miniPreview_) {
    miniPreview = _miniPreview_;
  }));

  it('should do something', function () {
    expect(!!miniPreview).toBe(true);
  });

});
