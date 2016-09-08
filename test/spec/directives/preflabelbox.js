'use strict';

describe('Directive: prefLabelBox', function () {

  // load the directive's module
  beforeEach(module('labelsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pref-label-box></pref-label-box>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the prefLabelBox directive');
  }));
});
