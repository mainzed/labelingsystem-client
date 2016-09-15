'use strict';

describe('Directive: resourceBox', function () {

  // load the directive's module
  beforeEach(module('labelsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<resource-box></resource-box>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the resourceBox directive');
  }));
});
