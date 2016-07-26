'use strict';

describe('Controller: VocabsCtrl', function () {

  // load the controller's module
  beforeEach(module('labelsApp'));

  var VocabsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VocabsCtrl = $controller('VocabsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VocabsCtrl.awesomeThings.length).toBe(3);
  });
});
