/*
Okay, so the original query code was incomprehensible.
This time, I'm commenting it heavily. I promise!
*/

function queryGenerator(parsed, queryDoc, positive) {
  // These determine whether we're matching or filtering. postiive = matching
  var rootMode, childMode, target, targetRev, targetFlat, targetFlatAdj;
  if (positive) {
    rootMode = "$or";
    childMode = "$all";
    target = parsed.subjects;
    targetRev = parsed.subjectsReverse;
    targetFlat = parsed.subjectsFlat;
    targetFlatAdj = parsed.subjectsFlatAdjectives;
  } else {
    rootMode = "$nor";
    childMode = "$nin";
    target = parsed.without;
    targetRev = parsed.withoutReverse;
    targetFlat = parsed.withoutFlat;
    targetFlatAdj = parsed.withoutFlatAdjectives;
  }

  _.each(target, function (descriptors, rootNoun) {
    var done = false;

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

    if (! done && ! _.isEmpty(descriptors)) {
      /*
      If we enter this block, then this is a root noun, i.e. a character name.
      The data structure is simply an array of adjectives.
      ["big", "sassy", "black"]
      */

      var rootDoc = {};

      /*
      Root->Child is a bit more complicated.
      i.e. matching "blue hat" against "black dog with blue hat"

      Note that in the absence of adjectives, this works by default.
      But if we had no adjectives, we wouldn't have even entered this block.

      This currently doesn't work, since pre-adjs aren't presently parsed...
      */
      //rootDoc["tags.subjectsFlatAdjectives." + rootNoun] = { $all: descriptors };

      // Now to $or together Root->Root and Root->Child.
      queryDoc[rootMode] = _.map(rootDoc, function (value, key) {
        var kv = {};
        kv[key] = value;
        return kv;
      });

      done = true;
    }
  });

  _.each(targetRev, function (descriptors, rootNoun) {
    _.each(descriptors, function (adjectives, parent) {
      /*
      If we enter this loop, then this is a child noun, i.e. a clothing item.
      The data structure is a k/v pair of parent noun names and adjective arrays.
      "yoko-littner": ["long", "red"]
      The parent noun is already guaranteed to be present, but we still need to check for:
      1. That this child noun is a child to that parent.
      2. That all the adjectives are present and associated with that parent.
      */

      /*
      This is a Child->Child query.
      i.e. matching "dog with blue hat" against "black dog with blue hat"
      */
      if (! _.isEmpty(adjectives)) {
        queryDoc["tags.subjectsReverse." + rootNoun + "." + parent] = {};
        queryDoc["tags.subjectsReverse." + rootNoun + "." + parent][childMode] = adjectives;
      }

      /*
      And last but not least, Child->Root.
      Actually, this is least, since we don't support it!
      i.e. matching "hat with dog" against "dog with hat"
      So enjoy the no-op.
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

  prettyPrint(queryDoc);

  return queryDoc;
};
