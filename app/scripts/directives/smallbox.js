'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('smallBox', function (ngDialog, $routeParams, $window, $rootScope, $location, LabelService, TooltipService, HelperService, ResourcesService) {
    return {
      templateUrl: "views/directives/small-box.html",
      restrict: 'E',

      link: function postLink(scope, element, attrs) {
        var boxType;
        var resource;
        var relation;

        // init
        getBoxVariables();

        function getBoxVariables() {

            scope.ngModel = scope.box;
            //console.log(scope.box);
            scope.tooltip = TooltipService.icons.types[scope.ngModel.type];

            resource = scope.ngModel.resource;
            relation = scope.ngModel.relation;
            boxType = scope.ngModel.boxType;

            // determine names
            //console.log(scope.box);
            if (boxType === "altLabel" || boxType === "prefLabel" || boxType === "description") {
                scope.text = resource.value;
            } else if (resource.prefLabels) {  // for internal labels
                for (var i = 0; i < resource.prefLabels.length; i++) {
                    if (resource.prefLabels[i].isThumbnail) {
                        scope.text = resource.prefLabels[i].value;
                    }
                }
            } else {
                scope.text = scope.box.resource.label;
            }

            // determine description
            if (resource.scopeNote) {
                scope.description = resource.scopeNote;
            }

            // determine css
            if (relation === "attribute") {
                scope.cssClass = "text";
            } else if (boxType === "label") {
                scope.cssClass = boxType + " " + "high";
            } else {
                scope.cssClass = boxType + " " + resource.quality;
            }
            //console.log(scope.cssClass);

            // determine type icon
            if (boxType === "description") {
                scope.type = "<span class='icon-note'></span>";
            } else if (boxType === "prefLabel") {
                scope.type = "<span class='icon-preflabel'></span>";
            } else if (boxType === "altLabel") {
                scope.type = "<span class='icon-altlabel'></span>";
            } else if (boxType === "label") {
                scope.type = "<span class='icon-label'></span>";
            } else if (boxType === "wayback") {
                scope.type = "(" + boxType + ")";
            } else {
                scope.type = "(" + resource.type + ")";
            }

            // determine relation icon
            if (relation === "exactMatch") {
                scope.relation = "<span class='icon-exact'></span>";

            } else if (relation === "closeMatch") {
                scope.relation = "<span class='icon-close'></span>";

            } else if (relation === "relatedMatch" || relation === "seeAlso" || relation === "related") {
                scope.relation = "<span class='icon-related'></span>";

            }

            // determine language
            scope.language = resource.lang;
        }

        scope.onBoxClick = function() {
            //console.log(boxType);
            if (boxType === "label") {
                scope.categories = [
                    "broader",
                    "related",
                    "narrower"
                ];
            } else if (boxType === "wayback") {
                scope.categories = ["seeAlso"];
            } else if (boxType === "prefLabel" || boxType === "altlabel" || boxType === "description") {
                scope.categories = [];
            } else {
                scope.categories = [
                    "broadMatch",
                    "exactMatch",
                    "relatedMatch",
                    "closeMatch",
                    "narrowMatch"
                ];
            }

            var templateURL;
            if (relation.indexOf("Match") > -1) {
                templateURL = 'views/dialogs/small-box-resource.html';
            } else {
                templateURL = 'views/dialogs/small-box-' + boxType + '.html';
            }

            var dialog = ngDialog.open({
                template: templateURL,
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: scope
            });

            // reload nanoscroll when this dialog is opened
            $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                if ($dialog.attr('id') === dialog.id) {
                    $(".nano").nanoScroller();
                }
            });

        };

        scope.onDeleteClick = function() {

            var updatedlabel;

            // get current label
            LabelService.get({id: $routeParams.lID}, function(label) {

                updatedlabel = label;

                if (boxType === "description") {
                    delete updatedlabel.scopeNote;

                } else {
                    var removeArray;
                    if (boxType === "prefLabel") {
                        removeArray = "prefLabels";
                    } else if (boxType === "altLabel") {
                        removeArray = "altLabels";
                    } else if (boxType === "description") {
                        removeArray = "scopeNote";
                    } else {
                        removeArray = relation;
                    }

                    // Find item index using indexOf+find
                    var index = _.indexOf(updatedlabel[removeArray], _.find(updatedlabel[removeArray], resource));
                    updatedlabel[removeArray].splice(index, 1);
                }

                // send updated label to server
                var jsonObject = {
                    item: updatedlabel,
                    user: "demo"
                };

                LabelService.update({id: $routeParams.lID}, jsonObject, function(res) {
                    // when successfull, remove current box
                    var index = _.indexOf(scope.boxes, _.find(scope.boxes, scope.box));
                    scope.boxes.splice(index, 1);
                }, function(res) {
                    console.log(res);
                });

            });

        };

        scope.openLabel = function() {
            $location.path('/admin/vocabularies/' + scope.box.resource.vocabID + '/labels/' + scope.box.resource.id);
        };

        /**
         * open resource-url in new tab
         */
        scope.openResource = function() {
            var url;
            if (scope.box.resource.type === "getty") {
                var id = scope.box.resource.uri.split('/').pop();
                url = 'http://www.getty.edu/vow/AATFullDisplay?find=&logic=AND&note=&subjectid=' + id;
            } else {
                url = scope.box.resource.uri;
            }
            // open url in new tab
            $window.open(url, "_blank");
        };

        /**
         * Updates an alt- or prefLabel with a newer term.
         * @param {string} type - type of the term ("altLabel" or "prefLabel")
         * @param {string} newValue - updated term text
         * @param {string} oldValue - original term text
         */
        scope.updateTerm = function(type, newValue, oldValue) {
            var key = type + "s";

            // get old label
            var query = { value: oldValue };
            var originalTerm = _.find(scope.label[key], query);

            // remove it from prefLabels array
            _.remove(scope.label[key], query);

            // build updated prefLabel
            var updatedTerm = originalTerm;
            updatedTerm.value = newValue;

            scope.label[key].push(updatedTerm);

            var jsonObject = {
                item: scope.label,
                user: scope.user.name
            };
            LabelService.update({ id: $routeParams.lID }, jsonObject, function() {
                // update current small box temporarily
                scope.box.resource = updatedTerm;

            }, function(res) {
                console.log(res);
            });
        };

        /**
         * Updates the label description.
         * @param {string} newValue - updated term text
         */
        scope.updateDescription = function(newValue) {

            scope.label.scopeNote.value = newValue;

            var jsonObject = {
                item: scope.label,
                user: scope.user.name
            };
            LabelService.update({ id: $routeParams.lID }, jsonObject, function() {
                // update current small box temporarily
                scope.box.resource = scope.label.scopeNote;

            }, function(res) {
                console.log(res);
            });
        };

        // listeners to update boxes when modified
        scope.$watchCollection("box.resource", function() {
            getBoxVariables();

            // reload nanoscroller when directive rendered
            $(".nano").nanoScroller();
        });
    }
  };
});
