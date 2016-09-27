'use strict';

describe('Service: LabelService', function () {
    var mockConcept;

    // load the service's module
    beforeEach(module('labelsApp'));

    // instantiate service
    var LabelService;
    beforeEach(inject(function (_LabelService_) {
        LabelService = _LabelService_;
    }));

    it('should do something', function () {
        expect(!!LabelService).toBe(true);
    });

    describe("Concept methods", function() {
        var concept;

        beforeEach(inject(function($httpBackend) {
            $httpBackend.when('GET', 'http://143.93.114.135/api/v1/labels/36799281-7c6c-4251-a0c1-ef20ce07a8b9').respond(200, JSON.stringify({
                id: '36799281-7c6c-4251-a0c1-ef20ce07a8b9',
                prefLabels: [
                    { value: "english label", lang: "en", isThumbnail: true },
                    { value: "german translation", lang: "de", isThumbnail: false },
                    { value: "icelandic translation", lang: "is" }
                ],
                scopeNote: { value: "a description", lang: "en"},
                broader: [
                    "some-broader-concept-id"
                ]
            }));

            // $httpBackend.when('GET', 'http://143.93.114.135/api/v1/labels/some-broader-concept-id').respond(200, JSON.stringify({
            //     id: 'some-broader-concept-id',
            //     prefLabels: [
            //         { value: "broader label", lang: "en", isThumbnail: true }
            //     ],
            //     scopeNote: { value: "a broader concept", lang: "en"}
            // }));

            concept = LabelService.get({id: "36799281-7c6c-4251-a0c1-ef20ce07a8b9"});
            $httpBackend.flush();
        }));

        it("should return mock concept object", function() {
            expect(concept.id).toBe("36799281-7c6c-4251-a0c1-ef20ce07a8b9");
        });

        it("getLabel() should return thumbnail prefLabel", function() {
            var label = concept.getLabel();
            expect(label).toBe("english label");
        });

        it("setLabel() should update thumbnail prefLabel", function() {
            concept.setLabel("new label");
            expect(concept.getLabel()).toBe("new label");
        });

        it("getTranslations() should return all prefLabel, but thumbnail prefLabel", function() {
            var translations = concept.getTranslations();
            expect(translations.length).toBe(2);
            expect(translations[0].value).toBe("german translation");
            expect(translations[0].lang).toBe("de");
        });

        it("addTranslation() should add prefLabel", function() {
            var translations = concept.getTranslations();
            expect(translations.length).toBe(2);

            concept.addTranslation({ value: "spanish translation", lang: "es"});
            translations = concept.getTranslations();
            expect(translations.length).toBe(3);
            expect(translations[2].value).toBe("spanish translation");
            expect(translations[2].lang).toBe("es");
        });

        it("updateTranslation() should update an existing translation", function() {
            //var translations = concept.getTranslations();
            //expect(translations.length).toBe(2);
        });

        it("getUrl() should return url", function() {
            //var url = concept.getDownloadUrl();
            //expect(url.split("/")).toBe("123");
        });

        it("getLang() should return language", function() {
            // when only title available
            delete concept.scopeNote;
            var language = concept.getLang();
            expect(language).toBe("en");

            // when only description available
            delete concept.title;
            language = concept.getLang();
            expect(language).toBe("en");
        });

        it("setDescription() should set description", function() {
            concept.setDescription("new description!");
            expect(concept.scopeNote.value).toBe("new description!");
            expect(concept.scopeNote.lang).toBe("en");
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
            expect(concept.getScore()).toBe(9);

            delete concept.broader;
            expect(concept.getScore()).toBe(4);
        });
    });


});
