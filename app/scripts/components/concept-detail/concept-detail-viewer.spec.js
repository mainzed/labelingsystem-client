"use strict";

describe('Component: lsConceptDetailViewer', function () {

    beforeEach(module('labelsApp'));

    var element;
    var scope;
    //var controller;

    beforeEach(inject(function($rootScope, $compile){
        scope = $rootScope.$new();
        element = angular.element('<span><h1>test123</h1></span>');
        //controller = element.controller;
        element = $compile(element)(scope);
        scope.outside = '1.5';
        scope.$apply();
    }));

    // it("should show icon", function() {
    //     var icon = element.find("span.icon-search");
    //     expect(icon.length).toBeTruthy();
    // });
    //
    // it("should show username", function() {
    //     var username = element.find(":nth-child(2)");
    //     expect(username.length).toBeTruthy();
    // });
});
