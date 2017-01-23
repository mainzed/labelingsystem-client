# Labeling System Client "lucy edition"

The Labeling System (LS) is a web application that allows registered users to create their own controlled vocabularies. Vocabularies consist of concepts described by a label, a description and translations. In addition, concepts can be linked to other concepts in the Linked Open Data Cloud or within the same vocabulary. These links can be hierarchical, associative or mapping. In contrast to other SKOS editors, the app provides a convenient way to look up concepts in selected controlled vocabularies in the LOD Cloud. It also enables users to publish their vocabularies, which makes its concepts publicly accessable via Uniform Resource Identifiers (URI).

## Setup
This LS client uses the LS Server API. See https://github.com/mainzed/labelingsystem-server for instructions on how to set it up the backend.

Run `git clone https://github.com/mainzed/labelingsystem-client.git` to create a local copy of this repository.  
Run `npm install` to install all node and bower modules.  
Run `grunt build` for building and `grunt serve` to start development server.  

## Unit tests
Running `grunt test` will run the unit tests with karma.

## E2E tests
Run `webdriver-manager update` and `webdriver-manager start` to get an instance of a Selenium Server running.
Run `protractor e2e-tests/protractor-conf.js` to run e2e tests with protractor.
