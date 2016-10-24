'use strict';

angular.module('labelsApp')
 .component('lsListBox', {
    bindings: {
       concept: "=",
       mode: "@"
    },
    templateUrl: "scripts/components/concepts/list-box/list-box.html",
    controller: function ($scope, $location, $routeParams, ConfigService) {
        var ctrl = this;
        var scope = $scope;
        scope.conceptDetails = {};

        ctrl.$onInit = function() {
            // workaround
            scope.concept = ctrl.concept;
        }

        /**
         * Shows the box's extension with additional information about the
         * specified concept.
         */
        scope.toggleExtension = function() {
            scope.showMore = !scope.showMore;
        };

       /**
        * Redirects to detail view of the specified concept.
        * @param {string} id - Concept ID
        */
       scope.onClick = function(id) {
           if (scope.mode === 'viewer') {
               $location.path("vocabularies/" + $routeParams.vID + "/concepts/" + id);
           } else {
               $location.path("editor/vocabularies/" + $routeParams.vID + "/concepts/" + id);
           }

       };

        /**
         * Watcher that resets nanoscroll each time the extentAll property
         * changes (e.g. by a button click on "extent all").
         */
        scope.$parent.$watch("extendAll", function(newVal) {
           scope.showMore = newVal;
           $(".nano").nanoScroller();
        });//


        /**
         * Watcher that resets nanoscroll each time a concept is extended
         * to show additional details.
         */
        scope.$watch("showMore", function(showMore) {
            if (showMore) {
                scope.concept.getDetails().then(function(conceptDetails) {
                    scope.conceptDetails = conceptDetails;
                    scope.$apply();
                });
            }

           // reset nanoscroll
           $(".nano").nanoScroller();
       });
   }
});
