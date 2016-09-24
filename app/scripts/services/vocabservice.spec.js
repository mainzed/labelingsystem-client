'use strict';

describe('Service: VocabService', function () {

    // load the service's module
    beforeEach(module('labelsApp'));

    // instantiate service
    var VocabService;
    beforeEach(inject(function (_VocabService_) {
        VocabService = _VocabService_;
    }));

    it('should do something', function () {
        expect(!!VocabService).toBe(true);
    });

    describe("Vocab methods", function() {
        var vocab;

        beforeEach(inject(function($httpBackend) {
            $httpBackend.when('GET', 'http://143.93.114.135/api/v1/vocabs/some-vocab-id').respond(200, JSON.stringify({
                id: 'some-vocab-id',
                title: { value: "vocab title", lang: "en" },
                description: { value: "vocab description", lang: "en"}
            }));

            vocab = VocabService.get({id: "some-vocab-id"});
            $httpBackend.flush();
        }));

        it("should return mock vocab object", function() {
            expect(vocab.id).toBe("some-vocab-id");
        });

        it("getLang() should return language", function() {
            expect(vocab.getLang()).toBe("en");
        });

        it("setTitle() should update title", function() {
            vocab.setTitle("new vocab title");
            expect(vocab.title.value).toBe("new vocab title");
            expect(vocab.title.lang).toBe("en");
        });

        it("setDescription() should create or update description", function() {
            vocab.setDescription("new vocab description");
            expect(vocab.description.value).toBe("new vocab description");
            expect(vocab.title.lang).toBe("en");
        });

        it("setThesauri() should replace thesauri");


    });


});
