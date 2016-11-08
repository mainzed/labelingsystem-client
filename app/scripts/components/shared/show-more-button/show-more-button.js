'use strict';

angular.module('labelsApp')
 .component('lsShowMoreButton', {
    bindings: {
        limit: "="
    },
    templateUrl: "scripts/components/shared/show-more-button/show-more-button.html",
    controller: ["ConfigService", function(ConfigService) {
        var ctrl = this;

        ctrl.$onInit = function() {};

        // on click, increases the resultsLimit so that more concepts will be shown
        ctrl.click = function() {
            ctrl.limit += ConfigService.conceptsLimit;
        };

    }]
});
