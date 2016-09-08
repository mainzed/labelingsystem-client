'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabeldetailCtrl
 * @description
 * # LabeldetailCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelDetailCtrl', function ($scope, $routeParams, $timeout, $location, $http, $document, ngDialog, AuthService, VocabService, LabelService, ResourcesService, TooltipService, SearchService, UserSettingsService, ThesauriService, LangService, WaybackService) {

    // authentication
    if ($location.path().indexOf("admin/") > -1) {  // is admin view
        if (!AuthService.getUser()) {
            // redirect if not logged in
            $location.path("admin/login");
        } else {
            // if logged in, get user name
            $scope.user = AuthService.getUser();
        }
    }
    $scope.tooltips = TooltipService;

    $scope.boxes = [];

    $scope.showEnrichments = UserSettingsService.showEnrichments;

    VocabService.get({id: $routeParams.vID}, function(vocabulary) {
        $scope.vocabulary = vocabulary;

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

        $scope.loadBoxes();

        $scope.prefLabel = _.find($scope.label.prefLabels, {isThumbnail: true});

        //$scope.loadBoxes();
    });

    // filters
    $scope.attributeFilter = function(box) {
        return box.relation === "attribute";
    };

    $scope.broaderFilter = function(box) {
        return box.relation === "broader" || box.relation === "broadMatch";
    };

    $scope.narrowerFilter = function(box) {
        return box.relation === "narrower" || box.relation === "narrowMatch";
    };

    $scope.relatedFilter = function(box) {
        return box.relation === "related" || box.relation === "closeMatch" || box.relation === "relatedMatch" || box.relation === "exactMatch" || box.relation === "seeAlso";
    };

    // when searching, append search results
    // search when something is entered,
    // ls results are cached anyway, everything else gets searched on change
    $scope.onSearchClick = function() {
        $scope.resultBoxes = [];

        // search in all thesauri and append as soon as they're found!
        $scope.thesauri.forEach(function(thesaurus) {

            SearchService.search(thesaurus.name, $scope.searchValue, function(results) {
                $.merge($scope.resultBoxes, results);

            }, function(res) {
                // error
                console.log(res);
            });
        });
    };

    /**
     * Get all of the concept's prefLabels, altLabels and description.
     * @param {Object} concept - Concept object
     * @param {Object} concept.scopeNote - Concept description
     * @param {Object} concept.prefLabels
     * @param {Object} concept.altLabels
     */
    $scope.getConceptAttributes = function(concept) {
        var attributeList = [];

        if (concept.scopeNote) {
            attributeList.push({
                relation: "attribute",
                boxType: "description",
                resource: concept.scopeNote
            });
        }

        if (concept.prefLabels) {
            concept.prefLabels.forEach(function(prefLabel) {
                //if (!prefLabel.isThumbnail) {  // ignore thumbnail preflabel
                attributeList.push({
                    relation: "attribute",
                    boxType: "prefLabel",
                    resource: prefLabel
                });
            });
        }

        if (concept.altLabels) {
            concept.altLabels.forEach(function(altLabel) {
                attributeList.push({
                    relation: "attribute",
                    boxType: "altLabel",
                    resource: altLabel
                });
            });
        }
        return attributeList;
    };

    // relations = ls internal
    $scope.getLabelRelations = function(label) {
        var relations = ["broader", "narrower", "related"];
        relations.forEach(function(relation) {
            if (label[relation]) {
                label[relation].forEach(function(id) {

                    LabelService.get({id: id}, function(label) {

                        $scope.boxes.push({
                            relation: relation,
                            boxType: "label",
                            resource: label
                        });
                    });
                });
            }
        });
    };

    // external labels
    $scope.getLabelMatches = function(label) {
        var matchTypes = ["broadMatch", "narrowMatch", "closeMatch", "relatedMatch", "exactMatch"];

        matchTypes.forEach(function(matchType) {
            if (label[matchType]) {
                label[matchType].forEach(function(match) {

                    ResourcesService.get(match.uri, function(resource) {
                        //console.log(resource);
                        // success
                        $scope.boxes.push({
                            relation: matchType,
                            boxType: resource.type,
                            resource: resource
                        });

                    }, function(errorMessage) {
                        // error
                        console.log(errorMessage);
                    });
                });
            }
        });
    };

    // wayback links
    $scope.getExternalResources = function(label) {
        if (label.seeAlso) {
            label.seeAlso.forEach(function(resource) {
                ResourcesService.get(resource.uri, function(externalResource) {
                    //$scope.seeAlsoResources.push(externalResource);//
                    //externalResource.url = resource.url;
                    $scope.boxes.push({
                        relation: "seeAlso",
                        boxType: "wayback",
                        resource: externalResource
                    });
                }, function(errorMessage) {
                    // failure
                    console.log(errorMessage);
                });
            });
        }
    };

    // used by views
    $scope.languages = LangService.get();
    //$scope.lang = "en";  // default

    $scope.onAddPrefLabel = function() {

        ngDialog.open({
            template: 'views/dialogs/add-preflabel.html',
            className: 'bigdialog',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            scope: $scope
        });

        $scope.onAddPrefLabelConfirm = function(term, lang) {

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
            }, function(label) {

                if (label.id) {
                    $scope.boxes.push({
                        relation: "attribute",
                        boxType: "prefLabel",
                        resource: newPrefLabel
                    });
                }
            });
        };
    };

    $scope.onAddAltLabel = function() {
        ngDialog.open({
            template: 'views/dialogs/add-altlabel.html',
            className: 'bigdialog',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            scope: $scope
        });

        $scope.onAddAltLabelConfirm = function(term, lang) {

            var newaltLabel = {
                value: term,
                lang: lang
            };

            // append new prefLabel to label
            if (!$scope.label.altLabels) {
                $scope.label.altLabels = [];
            }

            $scope.label.altLabels.push(newaltLabel);

            LabelService.update({ id: $routeParams.lID }, {
                item: $scope.label,
                user: "demo", //$scope.user.name
            }, function(label) {
                if (label.id) {
                    $scope.boxes.push({
                        relation: "attribute",
                        boxType: "altLabel",
                        resource: newaltLabel
                    });
                }
            });
        };
    };

    $scope.onAddDescription = function() {
        //console.log("add scopeNote");
        $scope.description = "";
        ngDialog.open({
            template: 'views/dialogs/add-description.html',
            className: 'bigdialog',
            disableAnimation: true,
            showClose: false,
            closeByDocument: false,
            scope: $scope
        });

        $scope.onAddDescriptionConfirm = function(text) {
            //console.log($scope.label);

            if (!$scope.label.scopeNote) {
                $scope.label.scopeNote = {};
            }

            // just push box, send to server silently
            $scope.label.scopeNote = {
                value: text,
                lang: $scope.prefLabel.lang
            };

            LabelService.update({ id: $routeParams.lID }, {
                item: $scope.label,
                user: $scope.user.name
            }, function(label) {
                if (label.id) {
                    $scope.boxes.push({
                        relation: "attribute",
                        boxType: "description",
                        resource: $scope.label.scopeNote
                    });
                }
            });
        };


    };

    $scope.onAddLink = function() {
        ngDialog.open({
            template: 'views/dialogs/add-wayback-link.html',
            className: 'bigdialog',
            disableAnimation: true,
            showClose: false,
            closeByDocument: false,
            scope: $scope
        });
    };

    $scope.addLinkConfirm = function(url) {//

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

    /**
     * gather information and generate box objects
     */
    $scope.loadBoxes = function() {

        $scope.boxes = [];
        // add description to attributeBoxes
        var attributes = $scope.getConceptAttributes($scope.label);
        attributes.forEach(function(attr) {
            $scope.boxes.push(attr);
        });

         

        // append to broaderBoxes etc
        $scope.getLabelRelations($scope.label);
        $scope.getLabelMatches($scope.label);
        $scope.getExternalResources($scope.label);
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

    // listener to reload nanoscroller when menu is hidden or shown
    $scope.$watch("showEnrichments", function() {
        $timeout(function() {
            $(".nano").nanoScroller();
        }, 0);
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
