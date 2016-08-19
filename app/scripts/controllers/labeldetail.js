'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabeldetailCtrl
 * @description
 * # LabeldetailCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelDetailCtrl', function ($scope, $routeParams, $location, $http, $document, ngDialog, AuthService, VocabService, LabelService, ExternalResourcesService, TooltipService, UserSettingsService) {

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
        getVocabThesauri(vocabulary.id);
    });

    // load label for the current vocabulary
    LabelService.get({id: $routeParams.lID}, function(label) {
        $scope.label = label;

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

    // get all thesauri associated with this vocabulary, preload these for search function
    $scope.thesauri = [];
    function getVocabThesauri(vocabID) {
        //console.log(vocabID);

        $http.get('http://143.93.114.135/api/v1/retcat/vocabulary/' + vocabID).then(function(res) {
            // success
            res.data.forEach(function(item) {
                $scope.thesauri.push(item.name);
            });

        }, function() {
            // error
        });
    }

    // when searching, append search results
    // search when something is entered,
    // ls results are cached anyway, everything else gets searched on change
    $scope.onSearchClick = function() {
        $scope.resultBoxes = [];

        // search in all thesauri and append as soon as they're found!
        $scope.thesauri.forEach(function(thesaurus) {

            $http.get('http://143.93.114.135/api/v1/resourcequery?retcat=' + thesaurus + '&query=' + $scope.searchValue).then(function(res) {
                $.merge($scope.resultBoxes, res.data);

            }, function() {
                // error
                console.log("something went wrong trying to get label search results!");
            });
        });
    };

    $scope.getLabelAttributes = function(label) {

        if (label.scopeNote) {
            $scope.boxes.push({
                relation: "attribute",
                boxType: "description",
                resource: label.scopeNote
            });

        }


        // add prefLabels to attributeBoxes
        if (label.prefLabels) {
            label.prefLabels.forEach(function(prefLabel) {
                if (!prefLabel.isThumbnail) {  // ignore thumbnail preflabel
                    $scope.boxes.push({
                        relation: "attribute",
                        boxType: "prefLabel",
                        resource: prefLabel
                    });
                }
            });
        }

        // add altLabels to attributeBoxes
        if (label.altLabels) {
            label.altLabels.forEach(function(altLabel) {
                altLabel.type = "text";
                $scope.boxes.push({
                    relation: "attribute",
                    boxType: "altLabel",
                    resource: altLabel
                });
            });
        }
    };

    // relations = ls internal
    $scope.getLabelRelations = function(label) {

        // get all broader ls labels
        if (label.broader) {
            label.broader.forEach(function(broaderID) {
                LabelService.get({id: broaderID}, function(label) {

                    // get thumbnail preflabel
                    var prefLabel;
                    for (var i = 0; i < label.prefLabels.length; i++) {
                        if (label.prefLabels[i].isThumbnail) {
                            prefLabel = label.prefLabels[i];
                        }
                    }
                    // append to boxes
                    $scope.boxes.push({
                        relation: "broader",
                        boxType: "label",
                        resource: prefLabel
                    });
                });
            });
        }

        if (label.narrower) {
            label.narrower.forEach(function(narrowerID) {
                LabelService.get({id: narrowerID}, function(label) {

                    // get thumbnail preflabel
                    var prefLabel;
                    for (var i = 0; i < label.prefLabels.length; i++) {
                        if (label.prefLabels[i].isThumbnail) {
                            prefLabel = label.prefLabels[i];
                        }
                    }

                    // append to boxes
                    $scope.boxes.push({
                        relation: "narrower",
                        boxType: "label",
                        resource: prefLabel
                    });
                });
            });
        }

        if (label.related) {
            label.related.forEach(function(relatedID) {
                LabelService.get({id: relatedID}, function(label) {

                    // get thumbnail preflabel
                    var prefLabel;
                    for (var i = 0; i < label.prefLabels.length; i++) {
                        if (label.prefLabels[i].isThumbnail) {
                            prefLabel = label.prefLabels[i];
                        }
                    }

                    // append to boxes
                    $scope.boxes.push({
                        relation: "related",
                        boxType: "label",
                        resource: prefLabel
                    });
                });
            });
        }

    };

    // external labels
    $scope.getLabelMatches = function(label) {

        if (label.broadMatch) {
            label.broadMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {

                    // success
                    $scope.boxes.push({
                        relation: "broadMatch",
                        boxType: resource.type,
                        resource: resource
                    });

                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }

        if (label.narrowMatch) {
            label.narrowMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    //console.log(resource);
                    $scope.boxes.push({
                        relation: "narrowMatch",
                        boxType: resource.type,
                        resource: resource
                    });
                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }

        if (label.closeMatch) {
            label.closeMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    $scope.boxes.push({
                        relation: "closeMatch",
                        boxType: resource.type,
                        resource: resource
                        // type: resource.type,
                        // value: resource.label,
                        // lang: resource.lang,
                        // quality: resource.quality
                    });
                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }

        //$scope.relatedMatches = [];
        if (label.relatedMatch) {
            label.relatedMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    $scope.boxes.push({
                        relation: "relatedMatch",
                        boxType: resource.type,
                        resource: resource
                    });
                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }

        //$scope.exactMatches = [];
        if (label.exactMatch) {
            label.exactMatch.forEach(function(match) {
                ExternalResourcesService.get(match.url, function(resource) {
                    // success
                    $scope.boxes.push({
                        relation: "exactMatch",
                        boxType: resource.type,
                        resource: resource
                    });

                }, function(errorMessage) {
                    // error
                    console.log(errorMessage);
                });
            });
        }
    };

    // wayback links
    $scope.getExternalResources = function(label) {
        if (label.seeAlso) {
            label.seeAlso.forEach(function(resource) {
                ExternalResourcesService.get(resource.url, function(externalResource) {
                    //$scope.seeAlsoResources.push(externalResource);//
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

    $scope.languages = [
        { name: "German", value: "de" },
        { name: "English", value: "en" },
        { name: "Spanish", value: "es" },
        { name: "Italian", value: "it" }
    ];
    $scope.lang = "EN";  // default

    $scope.onAddPrefLabel = function() {

        ngDialog.open({
            template: 'views/dialogs/add-preflabel.html',
            showClose: false,
            closeByDocument: false,
            disableAnimation: true,
            scope: $scope
        });

        $scope.onAddPrefLabelConfirm = function(term, lang) {
            $scope.boxes.push({
                category: "attribute",
                type: "prefLabel",
                value: term,
                lang: lang
            });
        };
    };

    $scope.onAddAltLabel = function() {
        //console.log("add altLabel");
        $scope.boxes.push({
            category: "attribute",
            type: "altLabel",
            value: "new altLabel",
            lang: "en"
        });
    };

    $scope.onAddDescription = function() {
        //console.log("add scopeNote");
        $scope.description = "insert label description here ...";
        ngDialog.open({
            template: 'views/dialogs/description-detail.html',
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

            // listener on $scope.label will update automatically
        };


    };

    $scope.onAddLink = function() {
        $scope.url = "http://";
        $scope.validWaybackLink = false;
        ngDialog.open({
            template: 'views/dialogs/add-wayback-link.html',
            disableAnimation: true,
            showClose: false,
            closeByDocument: false,
            scope: $scope
        });
    };

    // todo: put that in dialog-controller
    $scope.onGenerateClick = function(url) {

        $http.get('http://143.93.114.135/api/v1/resourcewayback?url=' + url).then(function(res) {
            // success
            // replace url with generated wayback-link
            $scope.url = res.data.url;

            $scope.validWaybackLink = true;

        }, function(res) {
            // error
            console.log("error");
            console.log(res.data.error);
            $scope.url = "http://";
            $scope.validWaybackLink = false;
        });
    };

    $scope.onLinkAddConfirm = function() {
        $scope.boxes.push({
            category: "seeAlso",
            type: "wayback",
            value: "Page title",
            quality: "low"
            //lang: "en"
        });
    };

    /**
     * gather information and generate box objects
     */
    $scope.loadBoxes = function() {

        $scope.boxes = [];
        // add description to attributeBoxes
        $scope.getLabelAttributes($scope.label);

        // append to broaderBoxes etc
        $scope.getLabelRelations($scope.label);
        $scope.getLabelMatches($scope.label);
        $scope.getExternalResources($scope.label);
    };

    $scope.showEnrichmentBrowser = function() {
        $scope.showEnrichments = true;
        UserSettingsService.showEnrichments = $scope.showEnrichments;
    };

    $scope.hideEnrichmentBrowser = function() {
        $scope.showEnrichments = false;
        UserSettingsService.showEnrichments = $scope.showEnrichments;
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
            disableAnimation: true,
            showClose: false,
            closeByDocument: false,
            scope: $scope
        });
    };

    $scope.onThumbnailPrefLabelEdit = function() {
        // Find item index using indexOf+find
        var index = _.indexOf($scope.label.prefLabels, _.find($scope.label.prefLabels, {isThumbnail: true}));

        $scope.label.prefLabels.splice(index, 1, {
            isThumbnail: true,
            value: $scope.thumbnail.value,
            lang: $scope.thumbnail.lang
        });
    };

    // listen to changes to the label
    $scope.$watchCollection("label", function(newVal) {
        //TODO: get differences and update boxes accordingly
        if (typeof newVal === 'object') {  // skip when label is not loaded yet
            $scope.loadBoxes();
        }
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
