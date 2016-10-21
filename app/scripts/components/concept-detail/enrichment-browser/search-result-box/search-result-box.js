'use strict';

angular.module("labelsApp")
 .component("lsSearchResultBox", {
    bindings: {
       data: "="
    },
    templateUrl: "scripts/components/concept-detail/enrichment-browser/search-result-box/search-result-box.html",

    // The controller that handles our component logic
    controller: function($scope, $routeParams, $rootScope, ngDialog, LabelService, TooltipService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;

            // determine type class
            $scope.typeClass = ctrl.data.type;

            $(".nano").nanoScroller();
        };


        // if (scope.data.type === "ls" && scope.data.scheme === scope.vocabulary.title) {
        //     scope.typeClass = "label";
        //
        //     // get additional information to fill preview and show draft class
        //     LabelService.get({ id: scope.data.uri.split("/").pop() }, function(concept) {
        //         scope.concept = concept;
        //     });
        //     //console.log(scope.data);
        // }


        /**
         * Opens a type-specific dialog that shows the connection (relation)
         * options for each type to link to the label.
         */
        ctrl.onClick = function() {
            ctrl.dialog = ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/search-result-box/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

        ctrl.toggleMore = function() {
            $scope.showMore = !$scope.showMore;
            $(".nano").nanoScroller();
        }

        /**
         * Link a search result as a child concept to the current concept.
         * @param {Object} conceptToAdd - internal or external concept object
         * @param {string} relation - Concept-to-Concept relation  (e.g. "broader" or "exactMatch")
         */
        ctrl.addResource = function(conceptToAdd, relation) {
            // get current concept
            LabelService.get({id: $routeParams.lID}, function(concept) {
                concept.addChild(conceptToAdd, relation);
                concept.save(function success() {
                    $rootScope.$broadcast("addedResource", { resource: conceptToAdd, relation: relation });
                    ctrl.dialog.close();
                });
            })
        };

    }
});
