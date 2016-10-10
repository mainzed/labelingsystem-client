"use strict";

describe('Component: lsEditUserButton', function () {

    beforeEach(module('labelsApp'));

    var element;
    var scope;
    var controller;

    beforeEach(inject(function($rootScope, $compile){
        scope = $rootScope.$new();
        element = angular.element('<ls-edit-vocab-button></ls-edit-vocab-button>');
        controller = element.controller;
        element = $compile(element)(scope);
        scope.outside = '1.5';
        scope.$apply();
    }));

    it("should show icon", function() {
        var icon = element.find("span.icon-user");
        expect(icon.length).toBeTruthy();
    });

    it("should show username", function() {
        var username = element.find(":nth-child(2)");
        expect(username.length).toBeTruthy();
    });
});
