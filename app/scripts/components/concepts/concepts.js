
/**
 * @ngdoc directive
 * @name labelsApp.directive:lsConcepts
 * @description
 * # smallBox
 */
 angular.module("labelsApp")
    .component("lsConcepts", {
        bindings: {
            mode: "@"
        },
        templateUrl: "scripts/components/concepts/concepts.html",
        controller: ["$scope", "$location", "$routeParams", "AuthService", "ConceptService", "VocabService", "TooltipService", "ConfigService", "$timeout", "CachingService", "LicenseService", function($scope, $location, $routeParams, AuthService, ConceptService, VocabService, TooltipService, ConfigService, $timeout, CachingService, LicenseService) {
            var ctrl = this;

            ctrl.$onInit = function() {
                ctrl.showMoreIsVisible = false;
                ctrl.loading = true;
                ctrl.license = "";
                $scope.labelFilter = "";
                $scope.labels = [];
                $scope.filteredLabels = [];
                $scope.tooltips = TooltipService;
                $scope.placeholder = "loading labels...";
                $scope.conceptsLimit = ConfigService.conceptsLimit;
                ctrl.vocabID = $routeParams.vID;


                $scope.labelOrder = "-lastModified";

                // init nanoscroller here to prevent default scrollbar while loading boxes
                angular.element(".nano").nanoScroller();

                // TODO: load currentVocab from cache
                var query = {
                    id: $routeParams.vID,
                    creatorInfo: true
                };

                VocabService.get(query, function(vocabulary) {
                    $scope.vocabulary = vocabulary;

                    LicenseService.query({}, function(licenses) {
                        ctrl.license = _.find(licenses, { link: $scope.vocabulary.license });
                    });
                });

                // load filter from cache of possible
                $scope.labelFilter = CachingService.getFilterByVocab(ctrl.vocabID);

                // get from cache or server
                if (CachingService[ctrl.mode].concepts && CachingService[ctrl.mode].concepts.vocabID === $routeParams.vID) {
                    // cached concepts are for the current vocab
                    $scope.labels = CachingService[ctrl.mode].concepts.items;
                    ctrl.loading = false;
                    $scope.placeholder = "filter";
                } else {
                    ctrl.loadConcepts();
                }
            };

            ctrl.$onDestroy = function() {
                // cache filter value
                if ($scope.labelFilter) {
                    CachingService.filters.concepts = {
                        vocabID: ctrl.vocabID,
                        value: $scope.labelFilter
                    };
                }

                // cache extend settings

                // cache concepts. doing this on destroy saves us from having to
                // update the cache when adding or removing concepts
                CachingService[ctrl.mode].concepts = {
                    vocabID: ctrl.vocabID,
                    items: $scope.labels
                };
            };

            ctrl.loadConcepts = function() {
                ctrl.loading = true;
                ConceptService.query({"vocab": $routeParams.vID}, function(labels) {
                    $scope.labels = labels;
                    ctrl.loading = false;
                });
            };

            /**
             * Creates a new concept by sending a new object to the api.
             * @param {Object} newConcept
             */
            $scope.createConcept = function(newConcept) {
                delete newConcept.thumbnailConfirm;
                newConcept.creator = AuthService.getUser().id;
                newConcept.vocabID = $scope.vocabulary.id;
                newConcept.language = $scope.vocabulary.language;

                if (newConcept.description.length < 1) {
                    delete newConcept.description;
                }

                ConceptService.save(newConcept, function(concept) {
                    if (concept.id) {
                        $scope.labels.push(concept);
                    }
                }, function error(res) {
                    console.log(res);
                });
            };

            $scope.onSearchClick = function() {
                $location.path("/search");
            };

            /**
             * Returns true when the available concepts exceed the limit defined in
             * the ConfigService.
             */
            ctrl.hasMoreConcepts = function() {
                return $scope.filteredLabels.length >= $scope.conceptsLimit;
            };

            ctrl.toggleExtent = function() {
                $scope.extendAll = !$scope.extendAll;
            };

            // refresh boxes when csv upload complete
            $scope.$on("csvUploadComplete", function() {
                ctrl.loadConcepts();
            });

            $scope.$on("removedConcept", function(event, data) {
                _.remove($scope.labels, { id: data.id });
            });

            $scope.$watch("loading", function(loading) {
                if (!loading) {
                    $timeout(function() {
                        angular.element("#filtersearch input").focus();
                    }, 0);
                }
            });
        }]
    });
