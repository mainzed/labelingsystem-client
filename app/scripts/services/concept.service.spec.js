'use strict';

describe('Service: ConceptService', function () {
    var mockConcept;

    // load the service's module
    beforeEach(module('labelsApp'));

    // instantiate service
    var ConceptService;
    beforeEach(inject(function (_ConceptService_) {
        ConceptService = _ConceptService_;
    }));

    it('should do something', function () {
        expect(!!ConceptService).toBe(true);
    });

    describe("Concept methods", function() {
        var concept;

        beforeEach(inject(function($httpBackend) {
            $httpBackend.when('GET', ConfigService.host + '/api/v1/labels/36799281-7c6c-4251-a0c1-ef20ce07a8b9?draft=true').respond(200, JSON.stringify({
                id: '36799281-7c6c-4251-a0c1-ef20ce07a8b9',
                thumbnail: "english label",
                translations: [
                    { value: "german translation", lang: "de" },
                    { value: "icelandic translation", lang: "is" }
                ],
                description: "a description",
                language: "en",
                broader: [
                    "some-broader-concept-id"
                ]
            }));

            // $httpBackend.when('GET', ConfigService.host + '/api/v1/labels/some-broader-concept-id').respond(200, JSON.stringify({
            //     id: 'some-broader-concept-id',
            //     prefLabels: [
            //         { value: "broader label", lang: "en", isThumbnail: true }
            //     ],
            //     scopeNote: { value: "a broader concept", lang: "en"}
            // }));

            concept = ConceptService.get({id: "36799281-7c6c-4251-a0c1-ef20ce07a8b9"});
            $httpBackend.flush();
        }));

        afterEach(inject(function($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));

        it("should return mock concept object", function() {
            expect(concept.id).toBe("36799281-7c6c-4251-a0c1-ef20ce07a8b9");
        });

        it("getUrl() should return url", function() {
            //var url = concept.getDownloadUrl();
            //expect(url.split("/")).toBe("123");
        });

        it("getLang() should return language", function() {
            // when only title available
            var language = concept.getLang();
            expect(language).toBe("en");
        });

        it("setDescription() should set description", function() {
            concept.setDescription("new description!");
            expect(concept.description).toBe("new description!");
        });

        it("getChildren() should return internal concepts");

        it("addChild() should add internal concept", function() {
            // narrower
            concept.addChild({ id: "some-concept-id" }, "narrower");
            expect(concept.narrower.length).toBe(1);
            expect(concept.narrower[0]).toBe("some-concept-id");

            // broader
            concept.addChild({ id: "some-concept-id" }, "broader");
            expect(concept.broader.length).toBe(2);
            expect(concept.broader[1]).toBe("some-concept-id");

            // related
            concept.addChild({ id: "some-concept-id" }, "related");
            expect(concept.related.length).toBe(1);
            expect(concept.related[0]).toBe("some-concept-id");
        });

        it("addChild() should add external concept", function() {
            concept.addChild({ uri: "some-concept-uri", type: "getty" }, "narrowMatch");
            expect(concept.narrowMatch.length).toBe(1);
            expect(concept.narrowMatch[0].type).toBe("getty");
            expect(concept.narrowMatch[0].uri).toBe("some-concept-uri");

            concept.addChild({ uri: "some-concept-uri", type: "chronontology" }, "broadMatch");
            expect(concept.broadMatch.length).toBe(1);
            expect(concept.broadMatch[0].type).toBe("chronontology");
            expect(concept.broadMatch[0].uri).toBe("some-concept-uri");

            concept.addChild({ uri: "some-concept-uri", type: "finto" }, "closeMatch");
            expect(concept.closeMatch.length).toBe(1);
            expect(concept.closeMatch[0].type).toBe("finto");
            expect(concept.closeMatch[0].uri).toBe("some-concept-uri");

            concept.addChild({ uri: "some-concept-uri", type: "ls" }, "relatedMatch");
            expect(concept.relatedMatch.length).toBe(1);
            expect(concept.relatedMatch[0].type).toBe("ls");
            expect(concept.relatedMatch[0].uri).toBe("some-concept-uri");

            concept.addChild({ uri: "some-concept-uri", type: "finto" }, "exactMatch");
            expect(concept.exactMatch.length).toBe(1);
            expect(concept.exactMatch[0].type).toBe("finto");
            expect(concept.exactMatch[0].uri).toBe("some-concept-uri");
        });

        it("addChild() should add wayback link", function() {
            concept.addChild({ uri: "some-wayback-link", type: "wayback" }, "seeAlso");
            expect(concept.seeAlso.length).toBe(1);
            expect(concept.seeAlso[0].type).toBe("wayback");
            expect(concept.seeAlso[0].uri).toBe("some-wayback-link");
        });

        it("getScore() should return the quality score number", function() {
            expect(concept.getScore()).toBe(8);

            delete concept.broader;
            expect(concept.getScore()).toBe(3);
        });
    });


});
