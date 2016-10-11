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

    controller: function ($scope, $timeout, $location, $routeParams, LabelService, TooltipService, ConfigService, CachingService, AgentService) {

        // init nanoscroller here to prevent default scrollbar while loading boxes
        $(".nano").nanoScroller();

        $scope.tooltips = TooltipService;

        // load current label
        LabelService.get({id: $routeParams.lID}, function(label) {
            $scope.label = label;
            AgentService.get({id: label.creator}, function(agent) {
                $scope.agent = agent;
            });
        });

        // cache all concepts for landing page (if user clicks on search icon)
        if (!CachingService.viewer.allConcepts) {
            LabelService.query(function(concepts) {
                CachingService.viewer.allConcepts = concepts;
            });
        }

        $scope.onSearchClick = function() {
            $location.path("/");
        };

        // copy to clipboard
        $scope.uri = ConfigService.host + "/item/label/" + $routeParams.lID;
        $scope.supported = false;

        $scope.success = function () {
            console.log('Copied!');
        };

        $scope.fail = function (err) {
            console.error('Error!', err);
        };

        // init nano-scroller (gets refreshed in directives after render)
        $(".nano").nanoScroller();
    }
});
