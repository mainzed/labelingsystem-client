'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
angular.module('labelsApp')
  .directive('smallBox', function (ngDialog, $routeParams, $window, $timeout, $rootScope, $location, LabelService, TooltipService) {
    return {
      templateUrl: "views/directives/small-box.html",
      restrict: 'E',

      link: function postLink(scope, element, attrs) {
        var boxType;
        var resource;
        var relation;

        scope.init = function() {
            scope.ngModel = scope.box;
            scope.tooltip = TooltipService.icons.types[scope.ngModel.type];

            resource = scope.ngModel.resource;
            relation = scope.ngModel.relation;
            boxType = scope.ngModel.boxType;

            // determine names
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
                scope.type = "<span class='icon-concept'></span>";
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

            // refresh nanoscroller
            $(".nano").nanoScroller();
        };

        /**
         * Opens a dialog with details on the selected resource, label, etc.
         */
        scope.onBoxClick = function() {
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
                    $timeout(function() {
                        $(".nano").nanoScroller();
                    }, 0);
                }
            });

        };

        /**
         * Deletes the selected resource, description, prefLabel or altLabel.
         */
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

                LabelService.update({id: $routeParams.lID}, jsonObject, function() {
                    // when successfull, remove current box
                    var index = _.indexOf(scope.boxes, _.find(scope.boxes, scope.box));
                    scope.boxes.splice(index, 1);
                }, function(err) {
                    console.log(err);
                });

            });

        };

        /**
         * redirect to new label path
         */
        scope.openLabel = function() {
            $location.path('/admin/vocabularies/' + scope.box.resource.vocabID + '/labels/' + scope.box.resource.id);
        };

        /**
         * open resource-url in new tab.
         * @param {Object} resource - Resource object
         * @param {string} resource.type - Resource type (e.g. "getty")
         * @param {string} resource.uri - Link url
         */
        scope.openResource = function(resource) {
            console.log(resource);
            var url;
            if (resource.type === "getty") {
                var id = resource.uri.split('/').pop();
                url = 'http://www.getty.edu/vow/AATFullDisplay?find=&logic=AND&note=&subjectid=' + id;
            } else {
                url = resource.uri || resource.url;
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

        /**
         * change the relation of a resource.
         * @param {string} newRelation - updated label-to-resource relation
         * @param {string} oldRelation - original label-to-resource relation
         */
        scope.changeResourceRelation = function(newRelation, oldRelation) {
            // get resource
            var query = { uri: scope.box.resource.uri };
            var resource = _.find(scope.label[oldRelation], query);

            // remove it from the array (e.g. remove a narrowMatch from the narrowWatch array)
            _.remove(scope.label[oldRelation], query);

            // push resource to the corresponding array (e.g. to the broaderMatch array)
            if (!scope.label[newRelation]) {
                scope.label[newRelation] = [];
            }

            scope.label[newRelation].push(resource);

            // update on server
            var jsonObject = {
                item: scope.label,
                user: scope.user.name
            };

            LabelService.update({ id: $routeParams.lID }, jsonObject, function() {
                scope.box.relation = newRelation;  // update relation
            }, function(res) {
                console.log(res);
            });

        };

        /**
         * change the relation of a label.
         * @param {string} newRelation - updated label-to-label relation
         * @param {string} oldRelation - original label-to-label relation
         */
        scope.changeLabelRelation = function(newRelation, oldRelation) {
            // remove id from old relation array
            _.remove(scope.label[oldRelation], function(n) {
              return n === scope.box.resource.id;
            });

            // add to new relation array
            if (!scope.label[newRelation]) {
                scope.label[newRelation] = [];
            }
            scope.label[newRelation].push(scope.box.resource.id);

            // update on server
            var jsonObject = {
                item: scope.label,
                user: scope.user.name
            };

            LabelService.update({ id: $routeParams.lID }, jsonObject, function() {
                scope.box.relation = newRelation;  // update relation

            }, function(res) {
                console.log(res);
            });

        };

        scope.init();

        // listeners to update boxes when modified
        scope.$watchCollection("box.resource", function() {
            scope.init();
        });

        scope.$watchCollection("box.relation", function() {
            scope.init();
        });
    }
  };
});
