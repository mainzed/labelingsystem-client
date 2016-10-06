# Labeling System v0.2

## Introduction
The Labeling System (LS) is a web-application that allows registered users to create controlled vocabularies. Vocabularies contain concepts that can be described by a label and translations. Since a concept is better described by links into the Linked Open Data cloud than by plain string, the LS allows users to link to other concepts (in the LOD cloud) (hierarchical, associative and mapping). It is possible to build in-vocab skos hierarchies. The app provides an easy and convenient search functions to search for concepts in lod cloud. To enrich concepts. Full text search. Once a concept is published, it can be publicly accessed via a Uniform Resource Identifier (URI).

## Getting Started

### Install
#### Labeling System Backend (TripleStore, SQLite, Item, API)
This web app uses the API provided by the Labeling System Server. See https://github.com/labelingsystem/server for instructions on how to set it up.

#### Labeling System Frontend (Editor and Viewer)
Run `git clone https://github.com/i3mainz/labels.git` to create a local copy of this repository.

Run `npm install` to install all node and bower modules.

Run `grunt build` for building and `grunt serve` to start development server.

Running `grunt test` will run the unit tests with karma.


### Create your first vocabulary/concept
Create vocabulary
Select title, description and language
New concept label has same language as vocab
Add description and translations

### link it
Link concept to sibling concepts or to concepts in lod cloud (e.g. Getty etc) or http way back machine
hierarchical (broader, narrower) and associative (related) relations to concepts in the same vocabulary via a list.
hierarchical (broadMatch, narrowMatch), associative (relatedMatch) and

mapping relations (closeMatch, exactMatch) to these concepts.

### Publish a concept
Publish concept so it can be accessed publicly via its uuid.
Once published it cannot be deleted and only limited changes can be made. This ensures that others can link to this concept persistently.
access concept via uuid

## FAQ
### What happens if a concept is published?
- the concept's label cannot be modified anymore
- visible via uri in LS Viewer to external users

### How do I create a synonym of a concept within a vocabulary?
Synonyms are not allowed in a controlled vocabulary. Workaround: it is possible to create a second vocabulary and link the concept as an exactMatch. However, exaactMatch is a unidirectional relation which means that the "synonym" in the second vocabulary does not know about the linked exactMatch concept.

### How can I map two concepts of different vocabularies?
- only possible to link to public concepts
