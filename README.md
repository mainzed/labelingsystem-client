# Labeling System Client "lucy edition"

The Labeling System offers experts the possibility to create concepts with context-bound validity, to concretize, to group in containers (vocabularies) and to share them with the research community. The LS provides user-friendly web tools that allow semantic linking of terms into the Linked Open Data Cloud. Once vocabularies are published, the LS serves as a distributed repository of concepts (concept-gazetteer), which provides citable addresses on the Web (URI). Each generated concept is explicit assigned to its creator. This assured authorship yield in a clear responsibility for data maintenance.

The Labeling System consists of three components: the [server](https://github.com/mainzed/labelingsystem-server), the [client wep-app](https://github.com/mainzed/labelingsystem-client) and the [datahub](https://github.com/mainzed/labelingsystem-datahub). The [datamodel](https://github.com/mainzed/labelingsystem-ontology) used in the backend is represented in an ontology using linked data vocabularies. This repository represents the server component of the Labeling System.

## Setup

This LS client uses the Labeling System Server API. See `https://github.com/mainzed/labelingsystem-server` for instructions on how to set it up the server.

Run `git clone https://github.com/mainzed/labelingsystem-client.git` to create a local copy of this repository.

Run `npm install` to install all required modules.

Run `npm run build` for building and `npm start` to start development server.

## Unit tests

Running `npm test` will run the unit tests with karma.

## E2E tests

Run `webdriver-manager update` and `webdriver-manager start` to get an instance of a Selenium Server running.

Run `protractor e2e-tests/protractor-conf.js` to run e2e tests with protractor.

### Credits

Developers:

* Matthias Dufner B.Sc.
    * Institut für Raumbezogene Informations- und Messtechnik (i3mainz)
* Axel Kunz M.Sc.
    * Institut für Raumbezogene Informations- und Messtechnik (i3mainz)
* Florian Thiery M.Sc.
    * Institut für Raumbezogene Informations- und Messtechnik (i3mainz)
    * Römisch-Germanisches Zentralmuseum, Leibniz-Forschungsinstitut für Archäologie (RGZM)
    * Mainzer Zentrum für Digitalität in den Geistes- und Kulturwissenschaften (mainzed)

### License

MIT License

Copyright (c) 2016 Matthias Dufner, Axel Kunz, Florian Thiery, i3mainz, RGZM, mainzed

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
