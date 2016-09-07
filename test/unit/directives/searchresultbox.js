'use strict';

describe('Directive: searchResultBox', function () {

  // load the directive's module
  beforeEach(module('labelsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<search-result-box></search-result-box>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the searchResultBox directive');
  }));
});
