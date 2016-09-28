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
                title: "vocab title",
                description: "vocab description",
                language: "en"
            }));

            vocab = VocabService.get({id: "some-vocab-id"});

            $httpBackend.flush();
        }));

        it("should return mock vocab object", function() {
            expect(vocab.id).toBe("some-vocab-id");
        });

        it("setThesauri() should replace thesauri");


    });


});
