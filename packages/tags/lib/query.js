/*
Okay, so the original query code was incomprehensible.
This time, I'm commenting it heavily. I promise!
*/

function queryGenerator(parsed, queryDoc, positive) {
  // These determine whether we're matching or filtering. postiive = matching
  var target, targetRev, targetFlat, targetFlatAdj;
  if (positive) {
    target = parsed.subjects;
    targetRev = parsed.subjectsReverse;
    targetFlat = parsed.subjectsFlat;
    targetFlatAdj = parsed.subjectsFlatAdjectives;
  } else {
    target = parsed.without;
    targetRev = parsed.withoutReverse;
    targetFlat = parsed.withoutFlat;
    targetFlatAdj = parsed.withoutFlatAdjectives;
  }

  _.each(target, function (descriptors, rootNoun) {
    if (! _.isEmpty(descriptors)) {
      /*
      Root->Child: `blue hat` with `dog: black, blue hat`
      We only need to do this if there are pre-adjs.
      */
      //queryDoc["tags.subjectsFlatAdjectives." + rootNoun] = { $all: descriptors };
    }
  });

  _.each(targetRev, function (descriptors, rootNoun) {
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
};

tagQuery = function (str) {
  if (! str) {
    return {};
  }

  var parsed = tagParser(str);

  var queryDoc = {};

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

  if (parsed.subjectsFlat.length) {
    /*
    This is the basic Root->Root query.
    All we're doing is checking for all root nouns existing.
    i.e. matching `dog` against `dog` or `dog: black, hat`
    */
    queryDoc["tags.subjectsFlat"] = { $all: parsed.subjectsFlat };
  }

  // Now we're ready for the meat of the query.
  // We're passing false, since this is the stuff we don't want to match.
  queryGenerator(parsed, queryDoc, false);
  // This takes true, since we want to match these.
  queryGenerator(parsed, queryDoc, true);

  /*
  // Meta stuff
  if (slice(rootNoun, 0, 3) === "id ") {
    // The query specifies a post ID, i.e. `id neJk82uvXvGH3Meig`.
    var id = slice(rootNoun, 3, undefined);
    if (positive) {
      queryDoc._id = id;
    } else {
      queryDoc._id = { $ne: id };
    }
    done = true;
  }

  if (! done && slice(rootNoun, 0, 5) === "name ") {
    // The query specifies a post name, i.e. `name DuplicitousVibrantXamdou`.
    var name = slice(rootNoun, 5, undefined);
    if (positive) {
      queryDoc.name = name;
    } else {
      queryDoc.name = { $ne: name };
    }
    done = true;
  }
  */

  prettyPrint(queryDoc);

  return queryDoc;
};
