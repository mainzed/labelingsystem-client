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
    controller: ["$scope", "$location", "$routeParams", "LabelService", "TooltipService", "ConfigService", "CachingService", "AgentService", "VocabService", "LicenseService", function($scope, $location, $routeParams, LabelService, TooltipService, ConfigService, CachingService, AgentService, VocabService, LicenseService) {
        var ctrl = this;

        ctrl.license = null;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;
            VocabService.get({id: $routeParams.vID}, function(vocab) {
                $scope.vocabulary = vocab;
                LicenseService.query({}, function(licenses) {
                    ctrl.license = _.find(licenses, { link: $scope.vocabulary.license });
                });
            });

            // load current label
            LabelService.getWithRevisions({id: $routeParams.lID}, function(label) {
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

            // copy to clipboard
            $scope.uri = ConfigService.host + "/item/label/" + $routeParams.lID;
            $scope.supported = false;

            angular.element(".nano").nanoScroller();
        }

        $scope.onSearchClick = function() {
            $location.path("/");
        };

        $scope.success = function () {
            console.log('Copied!');
        };

        $scope.fail = function (err) {
            console.error('Error!', err);
        };
    }]
});
