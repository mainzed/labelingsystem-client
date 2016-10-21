'use strict';

angular.module("labelsApp")
 .component("lsSearchResultBox", {
    bindings: {
       data: "="
    },
    templateUrl: "scripts/components/concept-detail/enrichment-browser/search-result-box/search-result-box.html",

    // The controller that handles our component logic
    controller: function($scope, ngDialog, TooltipService) {
        var ctrl = this;

        ctrl.$onInit = function() {
            $scope.tooltips = TooltipService;

            // determine type class
            $scope.typeClass = ctrl.data.type;
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
            ngDialog.open({
                template: 'scripts/components/concept-detail/enrichment-browser/search-result-box/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

        /**
         * Watcher that updates nanoscroller when box is extended.
         */
        // scope.$watch("showMore", function() {
        //     $(".nano").nanoScroller();
        // });
        //
        // reload nanoscroller when directive rendered
        $(".nano").nanoScroller();

    }
});
