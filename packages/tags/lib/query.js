function queryGeneratorAuthors(parsed, queryDoc) {
  var authorQuery = {};
  if (parsed.authors.length) {
    // If we're querying for authors, only return posts with all of those authors.
    authorQuery.$all = parsed.authors;
  }
  if (parsed.notAuthors.length) {
    // If we're excluding some authors, don't return posts with any of those authors.
    authorQuery.$nin = parsed.notAuthors;
  }
  if (! _.isEmpty(authorQuery)) {
    queryDoc["tags.authors"] = authorQuery;
  }
}

function queryGeneratorMeta(parsed, queryDoc) {
  if (_.has(parsed.meta, "id")) {
    // The query specifies a post ID, i.e. `id neJk82uvXvGH3Meig`.
    queryDoc._id = parsed.meta.id;
  }

  if (_.has(parsed.meta, "name")) {
    // The query specifies a post name, i.e. `name DuplicitousVibrantXamdou`.
    queryDoc.name = parsed.meta.name;
  }
}

function queryGeneratorWithout(parsed, queryDoc) {
  var exclude = [];

  _.each(parsed.without, function (descriptors, rootNoun) {
    if (! _.isEmpty(descriptors)) {
      // Root->Child
      //queryDoc["tags.subjectsFlatAdjectives." + rootNoun] = { $nin: descriptors };
    } else {
      exclude.push(rootNoun);
    }
  });

  if (exclude.length) {
    // Root->Root exclusion
    queryDoc["tags.subjectsFlat"] = { $nin: exclude };
  }

  _.each(parsed.withoutReverse, function (descriptors, rootNoun) {
    _.each(descriptors, function (adjectives, parent) {
      // Child->Child
      var doc = {};
      if (! _.isEmpty(adjectives)) {
        doc.$nin = adjectives;
      } else {
        doc.$exists = false;
      }
      queryDoc["tags.subjectsReverse." + rootNoun + "." + parent] = doc;
    });
  });
};

function queryGeneratorSubjects(parsed, queryDoc) {
  if (parsed.subjectsFlat.length) {
    /*
    This is the basic Root->Root query.
    All we're doing is checking for all root nouns existing.
    i.e. matching `dog` against `dog` or `dog: black, hat`
    */
    queryDoc["tags.subjectsFlat"] = { $all: parsed.subjectsFlat };
  }

  _.each(parsed.subjects, function (descriptors, rootNoun) {
    if (! _.isEmpty(descriptors)) {
      /*
      Root->Child: `blue hat` with `dog: black, blue hat`
      We only need to do this if there are pre-adjs.
      */
      //queryDoc["tags.subjectsFlatAdjectives." + rootNoun] = { $all: descriptors };
    }
  });

  _.each(parsed.subjectsReverse, function (descriptors, rootNoun) {
    _.each(descriptors, function (adjectives, parent) {
      /*
      Child->Child: `dog: blue hat` with `dog: black, blue hat`
      */
      var doc = { $exists: true };
      if (! _.isEmpty(adjectives)) {
        doc.$all = adjectives;
      }
      queryDoc["tags.subjectsReverse." + rootNoun + "." + parent] = doc;

      /*
      Child->Root: `hat: dog` with `dog: hat`
      We don't support this, for obvious reasons...
      */
    });
  });
}

tagQuery = function (str) {
  if (! str) {
    return {};
  }

  var parsed = tagParser(str);
  var queryDoc = {};

  queryGeneratorAuthors(parsed, queryDoc);
  queryGeneratorMeta(parsed, queryDoc);
  queryGeneratorWithout(parsed, queryDoc);
  queryGeneratorSubjects(parsed, queryDoc);

  prettyPrint(parsed);
  prettyPrint(queryDoc);

  return queryDoc;
};
