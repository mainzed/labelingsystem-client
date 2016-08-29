'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:searchResultBox
 * @description
 * # searchResultBox
 */
angular.module('labelsApp')
  .directive('searchResultBox', function (ngDialog, LabelService) {
    return {
        templateUrl: "views/directives/search-result-box.html",
        restrict: 'E',
        scope: {
            data: "=",  // data attribute available as scope.data (two-way-binding)
            vocabulary: "=vocab",
            label: "=",  // need label to append new data to
            boxes: "=",  // need to append new box and prevent reloading all boxes
            action: "&"  // get action to refresh boxes
        },
        link: function postLink(scope, element, attrs) {
            //scope.showMore = false;
            scope.type = scope.data.type;

            if (scope.type === "geonames") {
                //scope.mapID = "map-geonames-" + scope.data.uri.split("/").pop();
                scope.mapID = scope.data.uri.split("/").pop();
            }
            //scope.labelLimit = 25;

            if (scope.data.type === "ls" && scope.data.scheme === scope.vocabulary.title.value) {  // ls same vocab
                scope.icon = "<span class='icon-label'></span>";
                scope.type = "label";

            } else if (scope.data.type === "ls" && scope.data.scheme !== scope.vocabulary.title.value) {  // ls other vocabs
                scope.icon = "(" + scope.data.type + ")";
            } else {
                scope.icon = "(" + scope.data.type + ")";
            }

            /**
             * opens a type-specific dialog
             */
            scope.onClick = function() {
                ngDialog.open({
                    template: 'views/dialogs/add-resource.html',
                    className: 'bigdialog',
                    showClose: false,
                    closeByDocument: false,
                    disableAnimation: true,
                    scope: scope
                });
            };

            scope.onAddClick = function(relation) {
                // TODO: check everywhere if resource is already linked to this label somehow

                if (!scope.label[relation]) {
                    scope.label[relation] = [];
                }

                if (relation === "broader" || relation === "related" || relation === "narrower") {  // same vocab
                    // just push label-id to array
                    var labelID = scope.data.uri.split("/").pop();
                    scope.label[relation].push(labelID);

                } else {
                    scope.label[relation].push({
                        type: scope.data.type,
                        url: scope.data.uri
                    });
                }

                // refesh boxes via controller function
                scope.action();

                // var putObject = {
                //     "item": scope.label,
                //     "user": "fakeUser"
                // };
                // LabelService.update(scope.label.id, putObject, function(res) {
                //     // success
                //     console.log(res);
                // }, function(res) {
                //     console.log("error");
                //     console.log(res);
                // });
                // send changed label to server, get result for just this one change and update just one box

            };

            //
            scope.initMap = function(data) {

                if (data.type === "geonames") {
                    var regExp = /\[([^)]+)\]/;
                    var match = regExp.exec(data.description)[1];

                    var coords = match.split(" ");
                    //console.log(coords);
                    console.log(scope.mapID);
                    var map = L.map("map").setView([parseFloat(coords[0]), parseFloat(coords[1])], 13);

                    L.marker([parseFloat(coords[0]), parseFloat(coords[1])]).addTo(map).bindPopup(data.description);

                    var key = "pk.eyJ1Ijoic2hhbnl1YW4iLCJhIjoiY2lmcWd1cnFlMDI0dXRqbHliN2FzdW9kNyJ9.wPkC7amwS2ma4qKWmmWuqQ";

                    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/' + 'tiles/256/{z}/{x}/{y}?access_token=' + key, {
                    }).addTo(map);

                    //matches[1] contains the value between the parentheses
                    //console.log(matches[1]);
                }


            }

            // reload nanoscroller when directive rendered
            $(".nano").nanoScroller();
        }
    };
  });
