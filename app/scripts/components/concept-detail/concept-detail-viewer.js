'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsConceptDetailViewer', {
    bindings: {
    },
    templateUrl: "scripts/components/concept-detail/concept-detail-viewer.html",

    controller: function ($scope, $location, $routeParams, LabelService, TooltipService) {

        // init nanoscroller here to prevent default scrollbar while loading boxes
        $(".nano").nanoScroller();

        $scope.tooltips = TooltipService;

        // load current label
        $scope.label = LabelService.get({id: $routeParams.lID});

        $scope.onSearchClick = function() {
            $location.path("/");
        };

        // init nano-scroller (gets refreshed in directives after render)
        $(".nano").nanoScroller();
    }
});
