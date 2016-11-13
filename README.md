# Labeling System Client v0.3

The Labeling System (LS) is a web application that allows registered users to create their own controlled vocabularies. Vocabularies consist of concepts described by a label, a description and translations. In addition, concepts can be linked to other concepts in the Linked Open Data Cloud or within the same vocabulary. These links can be hierarchical, associative or mapping. In contrast to other SKOS editors, the app provides a convenient way to look up concepts in selected controlled vocabularies in the LOD Cloud. It also enables users to publish their vocabularies, which makes its concepts publicly accessable via Uniform Resource Identifiers (URI).

## Setup
This LS client uses the LS Server API. See https://github.com/mainzed/labelingsystem-server for instructions on how to set it up the backend.

Run `git clone https://github.com/i3mainz/labels.git` to create a local copy of this repository.  
Run `npm install` to install all node and bower modules.  
Run `grunt build` for building and `grunt serve` to start development server.  

## Unit tests
Running `grunt test` will run the unit tests with karma.

## E2E tests
Run `webdriver-manager update` and `webdriver-manager start` to get an instance of a Selenium Server running. 
Run `protractor e2e-tests/protractor-conf.js` to run e2e tests with protractor.

## FAQ

## Credits

Software Developers:

- Mathias Dufner B.A.
 - Institut für Raumbezogene Informations- und Messtechnik (i3mainz)
- Axel Kunz M.Sc.
 - Institut für Raumbezogene Informations- und Messtechnik (i3mainz)

## License

MIT License

Copyright (c) 2016 Axel Kunz, Matthias Dufner, i3mainz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
