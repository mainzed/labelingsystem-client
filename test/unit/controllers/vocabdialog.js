'use strict';

describe('Controller: VocabdialogCtrl', function () {

  // load the controller's module
  beforeEach(module('labelsApp'));

  var VocabdialogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VocabdialogCtrl = $controller('VocabdialogCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VocabdialogCtrl.awesomeThings.length).toBe(3);
  });
});
