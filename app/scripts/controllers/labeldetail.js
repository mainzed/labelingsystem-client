'use strict';

/**
 * @ngdoc function
 * @name labelsApp.controller:LabeldetailCtrl
 * @description
 * # LabeldetailCtrl
 * Controller of the labelsApp
 */
angular.module('labelsApp')
  .controller('LabelDetailCtrl', function ($scope, $routeParams, $location, $http, $document, ngDialog, AuthService, VocabService, LabelService, ExternalResourcesService, TooltipService) {

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

    // init nanoscroll
    $(".nano").nanoScroller();

    VocabService.get({id: $routeParams.vID}, function(vocabulary) {
        $scope.vocabulary = vocabulary;
        getVocabThesauri(vocabulary.id);
    });

    // load label for the current vocabulary
    LabelService.get({id: $routeParams.lID}, function(label) {
        $scope.label = label;


        // broader, narrower and related gathered later
        label.prefLabels.forEach(function(prefLabel) {
            if (prefLabel.isThumbnail) {
                $scope.prefLabel = prefLabel;
            }
        });

        $scope.loadBoxes();
    });

    // filters
    $scope.attributeFilter = function(box) {
        return box.category === "attribute";
    };

    $scope.broaderFilter = function(box) {
        return box.category === "broader" || box.category === "broadMatch";
    };

    $scope.narrowerFilter = function(box) {
        return box.category === "narrower" || box.category === "narrowMatch";
    };

    $scope.relatedFilter = function(box) {
        return box.category === "related" || box.category === "closeMatch" || box.category === "relatedMatch" || box.category === "exactMatch" || box.category === "seeAlso";
    };

    // get all thesauri associated with this vocabulary, preload these for search function
    $scope.thesauri = ["Local Labeling System"];
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
                // append results
                //console.log("results for " + thesaurus + ": " + res.data.length);

                //$scope.resultBoxes.concat(res.data);
                $.merge($scope.resultBoxes, res.data);

                //console.log(res.data[0]);

            }, function() {
                // error
                console.log("something went wrong trying to get label search results!");
            });
        });

    };

    $scope.getLabelAttributes = function(label) {

        if (label.scopeNote) {
            $scope.boxes.push({
                category: "attribute",
                type: "description",
                value: label.scopeNote.value,
                lang: label.scopeNote.lang
            });
        }

        // add prefLabels to attributeBoxes
        if (label.prefLabels) {
            label.prefLabels.forEach(function(prefLabel) {
                if (!prefLabel.isThumbnail) {  // ignore thumbnail preflabel
                    $scope.boxes.push({
                        category: "attribute",
                        type: "prefLabel",
                        value: prefLabel.value,
                        lang: prefLabel.lang
                    });
                }
            });
        }

        // add altLabels to attributeBoxes
        if (label.altLabels) {
            label.altLabels.forEach(function(altLabel) {

                $scope.boxes.push({
                    category: "attribute",
                    type: "altLabel",
                    value: altLabel.value,
                    lang: altLabel.lang
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
                        category: "broader",
                        type: "label",
                        value: prefLabel.value,
                        lang: prefLabel.lang,
                        quality: "high"
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
                        category: "narrower",
                        type: "label",
                        value: prefLabel.value,
                        lang: prefLabel.lang,
                        quality: "high"
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
                        category: "related",
                        type: "label",
                        value: prefLabel.value,
                        lang: prefLabel.lang,
                        quality: "high"
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
                    console.log(resource);
                    // success
                    $scope.boxes.push({
                        category: "broadMatch",
                        type: resource.type,
                        value: resource.label,
                        lang: resource.lang,
                        quality: resource.quality
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
                    console.log(resource);
                    $scope.boxes.push({
                        category: "narrowMatch",
                        type: resource.type,
                        value: resource.label,
                        lang: resource.lang,
                        quality: resource.quality
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
                        category: "closeMatch",
                        type: resource.type,
                        value: resource.label,
                        lang: resource.lang,
                        quality: resource.quality
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
                        category: "relatedMatch",
                        type: resource.type,
                        value: resource.label,
                        lang: resource.lang,
                        quality: resource.quality
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
                        category: "exactMatch",
                        type: resource.type,
                        value: resource.label,
                        lang: resource.lang,
                        quality: resource.quality
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
                        category: "seeAlso",
                        type: externalResource.type,
                        value: externalResource.label,
                        quality: "low"

                    });
                }, function(errorMessage) {
                    // failure
                    console.log(errorMessage);
                });
            });
        }
    };

    $scope.onNarrowerClick = function(label) {

        // prevent from adding label as broader and narrower
        if ($scope.label.broader) {
            if ($scope.label.broader.indexOf(label.id) > -1) {
                return false;
            }
        }

        if (!$scope.label.narrower) {
            $scope.label.narrower = [label.id];
        } else if ($scope.label.narrower.indexOf(label.id) === -1) {
            $scope.label.narrower.push(label.id);
        }

        // refresh
        $scope.getLabelRelations($scope.label);
    };

    $scope.onBroaderClick = function(label) {

        // prevent from adding label as broader and narrower
        if ($scope.label.narrower) {
            if ($scope.label.narrower.indexOf(label.id) > -1) {
                return false;
            }
        }

        if (!$scope.label.broader) {
            $scope.label.broader = [label.id];
        } else if ($scope.label.broader.indexOf(label.id) === -1) {
            $scope.label.broader.push(label.id);
        }

        // refresh
        $scope.getLabelRelations($scope.label);
    };

    $scope.onAddPrefLabel = function() {
        //console.log("add prefLabel");
        $scope.boxes.push({
            category: "attribute",
            type: "prefLabel",
            value: "new prefLabel",
            lang: "en"
        });
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
            //className: "smalldialog",
            scope: $scope
        });

        $scope.boxes.push({
            category: "attribute",
            type: "description",
            value: "this is a new description",
            lang: "en"
        });
    };

    $scope.onAddLink = function() {

        $scope.url = "http://";
        $scope.validWaybackLink = false;

        ngDialog.open({
            template: 'views/dialogs/add-wayback-link.html',
            disableAnimation: true,
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
        console.log($scope.label);
        $scope.boxes = [];
        // add description to attributeBoxes
        $scope.getLabelAttributes($scope.label);

        // append to broaderBoxes etc
        $scope.getLabelRelations($scope.label);
        $scope.getLabelMatches($scope.label);
        $scope.getExternalResources($scope.label);
    };
    // hotkeys
    $document.keydown(function(e) {
        if (e.keyCode === 13) {  // enter
            if ($scope.searchValue) {  // input is not empty
                $scope.onSearchClick();
            }
        }
    });


  });
