# Labeling System Client v0.3

## Introduction
The Labeling System (LS) is a web-application that allows registered users to create controlled vocabularies. Vocabularies consist of concepts described by a label and translations. In addition, concepts can be linked to other concepts in the Linked Open Data Cloud. These links can be hierarchical, associative or mapping. The app provides a convenient way to search through controlled vocabularies in the Linked Open Data Cloud. Once a LS concept is published, it can be publicly accessed via a Uniform Resource Identifier (URI).

## Getting Started

## Setup
This web app uses the API provided by the Labeling System Server (TripleStore, SQLite, Item, API). See https://github.com/labelingsystem/server for instructions on how to set it up the backend.

## Local development environment
Run `git clone https://github.com/i3mainz/labels.git` to create a local copy of this repository.
Run `npm install` to install all node and bower modules.
Run `grunt build` for building and `grunt serve` to start development server.

## Unit tests
Running `grunt test` will run the unit tests with karma.

## E2E tests
Run `webdriver-manager update`
Run
Running `protractor e2e-tests test` will run the unit tests with karma.
