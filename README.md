# Introduction
The Labeling System (LS) is a web-application that allows registered users to create controlled vocabularies. Vocabularies contain concepts that can be described by a label and translations. Since a concept is better described by links into the Linked Open Data cloud than by plain string, the LS allows users to link to other concepts (in the LOD cloud) (hierarchical, associative and mapping). It is possible to build in-vocab skos hierarchies. Once a concept is published, it can be publicly accessed via a Uniform Resource Identifier (URI).

The app provides an easy and convenient search functions to search for concepts in lod cloud. To enrich concepts . Full text search.

# Getting Started


## Install
### LS Backend (TripleStore, SQLite, Item, API)
See https://github.com/labelingsystem/server for instructions on how to setup a the backend.

### LS Frontend (Editor and Viewer)
Git clone this

npm install

Run `grunt build` for building and `grunt serve` to start development server.

Running `grunt test` will run the unit tests with karma.


## Create your first vocabulary
Create vocabulary
Select title, description and language
New concept label has same language as vocab
Add description and translations

## link it
Link concept to sibling concepts or to concepts in lod cloud (e.g. Getty etc) or http way back machine
hierarchical (broader, narrower) and associative (related) relations to concepts in the same vocabulary via a list.
hierarchical (broadMatch, narrowMatch), associative (relatedMatch) and

mapping relations (closeMatch, exactMatch) to these concepts.

## Publish a concept
Publish concept so it can be accessed publicly via its uuid.
Once published it cannot be deleted and only limited changes can be made. This ensures that others can link to this concept persistently.
access concept via uuid

# FAQ
## What happens if a concept is published?
- prior to publishing concepts can be modified
- once published, cannot be modified and visible via uri in LS Viewer

## How do I create a synonym of a concept within a vocabulary?
Synonyms are not allowed in a controlled vocabulary. Workaround: it is possible to create a second vocabulary and link the concept as an exactMatch. However, exaactMatch is a unidirectional relation which means that the "synonym" in the second vocabulary does not know about the linked exactMatch concept.

## How can I map two concepts of different vocabularies?
- only possible to link to public concepts

## A new thesauri ha just been published. How can I link my published concepts to it?
- not possible
- workaround: create 'new edition' of vocabulary and link with exact match to old vocab and publish new one.
