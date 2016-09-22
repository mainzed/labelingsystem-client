'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabeldetailCtrl
 * @description
 * # LabeldetailCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelDetailCtrl', function ($scope, $routeParams, $timeout, $location, $http, $document, ngDialog, AuthService, VocabService, LabelService, ResourcesService, TooltipService, SearchService, UserSettingsService, ThesauriService, WaybackService, ConfigService) {

    // init nanoscroller here to prevent default scrollbar while loading boxes
    $(".nano").nanoScroller();

    $scope.user = AuthService.getUser();

    $scope.tooltips = TooltipService;

    $scope.showEnrichments = UserSettingsService.showEnrichments;

    VocabService.get({id: $routeParams.vID}, function(vocabulary) {
        $scope.vocabulary = vocabulary;

        // get this vocabularies labels to show in enrichment tab
        $scope.getVocabLabels();

        // get this vocabulary's associated thesauri for search function
        ThesauriService.get({id: $routeParams.vID}, function(thesauri) {
            $scope.thesauri = thesauri;
        }, function(err) {
            console.log(err);
        });
    });

    // load label for the current vocabulary
    LabelService.get({id: $routeParams.lID}, function(label) {
        $scope.label = label;
        //console.log(label);
        $scope.prefLabel = _.find($scope.label.prefLabels, {isThumbnail: true});
    });

    // gets all vocab labels to show in vocab tab
    $scope.getVocabLabels = function() {
        LabelService.query({'vocab': $routeParams.vID}, function(labels) {
            $scope.labels = labels;
            //$scope.placeholder = "filter";
        });
    };

    /**
     * Get skos of label url
     * @param {string} id - label ID
     * @return {string} url to download vocab in skos format
     */
    $scope.getDownloadUrl = function(id) {
        return ConfigService.host + "/labels/" + id;
    };

    // when searching, append search results
    // search when something is entered,
    // ls results are cached anyway, everything else gets searched on change
    $scope.onSearchClick = function() {
        $scope.resultBoxes = [];

        // rcheck if entire ls gets searched, ignore own vocab results if so
        var result = _.find($scope.thesauri, { type: "ls"});

        // search in all thesauri and append as soon as they're found!
        $scope.thesauri.forEach(function(thesaurus) {
            if (!(result && thesaurus.name.indexOf("this.") > -1)) {  // ignore local vocab

                SearchService.search(thesaurus.name, $scope.searchValue, function(results) {
                    $.merge($scope.resultBoxes, results);

                }, function(res) {
                    // error
                    console.log(res);
                });
            }

        });
    };

    // used by views
    $scope.languages = ConfigService.languages;

    // TODO: put that in component controller
    $scope.addTranslation = function(term, lang) {
        var newPrefLabel = {
            isThumbnail: false,
            value: term,
            lang: lang
        };

        // append new prefLabel to label
        $scope.label.prefLabels.push(newPrefLabel);

        LabelService.update({ id: $routeParams.lID }, {
            item: $scope.label,
            user: $scope.user.name
        }, function (label) {
            console.log("success");
        });
    };

    /**
     * Adds a description to the current concept.
     */
    $scope.addDescription = function(description) {

        var updatedConcept = $scope.label;
        updatedConcept.scopeNote = {
            value: description,
            lang: $scope.prefLabel.lang
        };

        var jsonObj = {
            item: $scope.label,
            user: AuthService.getUser().name
        };

        LabelService.update({ id: $routeParams.lID }, jsonObj, function success(label) {
            // temporarily update concept on success
            $scope.label.scopeNote = label.scopeNote;

        }, function error(res) {
            console.log(res);
        });
    };

    $scope.addLink = function(url) {
        console.log("add link");
        console.log(url);

        WaybackService.get(url, function(waybackUri) {
            if (!$scope.label.seeAlso) {
                $scope.label.seeAlso = [];
            }

            // append wayback link as seeAlso
            $scope.label.seeAlso.push({
                type: "wayback",
                uri: waybackUri
            });

            LabelService.update({id: $routeParams.lID}, {
                item: $scope.label,
                user: $scope.user.name
            }, function() {

                // TODO: add temporary box
                // add new box
                // $scope.boxes.push({
                //     category: "seeAlso",
                //     type: "wayback",
                //     //value: "Page title",
                //     quality: "low"
                // });

            }, function(err) {
                console.log(err);
            });
        }, function(err) {
            console.log(err);
        });
    };

    /**
     * filter results to ommit current label
     */
    $scope.resultFilter = function(box) {
        if (box.type === "ls" && box.scheme === $scope.vocabulary.title.value) {
            if (box.uri.split("/").pop() === $routeParams.lID) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };

    $scope.showEnrichmentBrowser = function() {
        $scope.showEnrichments = true;
        UserSettingsService.showEnrichments = $scope.showEnrichments;
        //$(".nano").nanoScroller();
    };

    $scope.hideEnrichmentBrowser = function() {
        $scope.showEnrichments = false;
        UserSettingsService.showEnrichments = $scope.showEnrichments;
        //$(".nano").nanoScroller();
    };

    // open dialog with label-metadata
    $scope.onLabelHeadingClick = function() {

        var thumbnail = _.find($scope.label.prefLabels, function(o) { return o.isThumbnail === true; });
        // putting values in new object prevents auto-update in breadcrumbs
        $scope.thumbnail = {
            value: thumbnail.value,
            lang: thumbnail.lang
        };

        $scope.status = $scope.label.statusType;

        ngDialog.open({
            template: 'views/dialogs/label-metadata.html',
            className: 'bigdialog',
            disableAnimation: true,
            showClose: false,
            closeByDocument: false,
            scope: $scope
        });
    };

    /**
     * Deletes a concept based on its ID.
     * @param {string} id - Concept ID
     */
    $scope.deleteConcept = function(id) {
        LabelService.remove({id: id}, function() {
            // redirect to concept overview
            $location.path("/admin/vocabularies/" + $scope.vocabulary.id + "/concepts");
        }, function(err) {
            console.log(err);
        });
    };

    /**
     * Link a search result to the current label by added the resource's
     * information to the according relation-array of the label.
     * @param {Object} resource - resource object
     * @param {string} relation - Label-to-Resource relation  (e.g. "broader" or "exactMatch")
     */
    $scope.addResource = function(resource, relation) {

        // get current label
        var updatedLabel = $scope.label;

        if (!updatedLabel[relation]) {
            updatedLabel[relation] = [];
        }

        if (relation === "broader" || relation === "related" || relation === "narrower") {  // same vocab
            //console.log(resource);
            var labelID;
            if (resource.uri) {
                labelID = resource.uri.split("/").pop();
            } else {
                labelID = resource.id;
            }
            // just push label-id to array
            updatedLabel[relation].push(labelID);

        } else {
            updatedLabel[relation].push({
                type: resource.type,
                uri: resource.uri
            });
        }

        var updateObject = {
            item: updatedLabel,
            user: "demo"
        };

        LabelService.update({id: updatedLabel.id}, updateObject, function() {
            // adds new box automatically
        }, function(err) {
            console.log(err);
        });

    };

    // listener to reload nanoscroller when menu is hidden or shown
    $scope.$watch("showEnrichments", function() {
        $timeout(function() {
            $(".nano").nanoScroller();
        }, 0);
    });

    $scope.$on('removed-description', function() {
        delete $scope.label.scopeNote;
    });

    // hotkeys
    $document.keydown(function(e) {
        if (e.keyCode === 13) {  // enter
            if ($scope.searchValue) {  // input is not empty
                $scope.onSearchClick();
            }
        }
    });

    // init nano-scroller (gets refreshed in directives after render)
    $(".nano").nanoScroller();

  });
