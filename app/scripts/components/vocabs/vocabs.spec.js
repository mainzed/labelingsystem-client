"use strict";

describe('Component: lsVocabs', function () {

    beforeEach(module('labelsApp'));

    var element;
    var scope;
    var $ctrl;

    beforeEach(inject(function($rootScope, $compile){
        scope = $rootScope.$new();
        element = angular.element('<ls-vocabs></ls-vocabs>');
        //controller = element.controller;
        element = $compile(element)(scope);
        scope.$apply();
        // $ctrl = $componentController("lsVocabs");
        // $ctrl.$onInit();

        //$ctrl.$onChanges();


    }));
    //
    // it("should render title", function() {
    //     var icon = element.find("#header");
    //     expect(icon.length.toBeTruthy());
    // });

    // it("should call openDialog() on click", function() {
    //     element.find("span.icon-more").click();
    //     // spyOn(scope, 'openDialog');
    //     //
    //     // // Run stuff to trigger doSomething()
    //     //
    //     // expect(scope.openDialog).toHaveBeenCalled();
    //     expect(controller.data).toBe("123");
    // });
    // it("should open dialog", function() {
    //     var icon = element.find("span.icon-more");
    //     icon.click();
    // });


});
