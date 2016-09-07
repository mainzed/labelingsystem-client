'use strict';

describe('Controller: LabelsCtrl', function () {

  // load the controller's module
  beforeEach(module('labelsApp'));

  var LabelsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabelsCtrl = $controller('LabelsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LabelsCtrl.awesomeThings.length).toBe(3);
  });
});
