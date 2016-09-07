'use strict';

describe('Controller: LabeldetailCtrl', function () {

  // load the controller's module
  beforeEach(module('labelsApp'));

  var LabeldetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabeldetailCtrl = $controller('LabeldetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LabeldetailCtrl.awesomeThings.length).toBe(3);
  });
});
