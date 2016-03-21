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

function queryGeneratorOrigins(parsed, queryDoc) {
  var originQuery = {};
  if (parsed.origins.length) {
    originQuery.$all = parsed.origins;
  }
  if (parsed.notOrigins.length) {
    originQuery.$nin = parsed.notOrigins;
  }
  if (! _.isEmpty(originQuery)) {
    queryDoc["tags.origins"] = originQuery;
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

function queryGeneratorWithout(parsed, extLookup, wDoc) {
  var exclude = [];

  _.each(parsed.without, function (descriptors, rootNoun) {
    if (_.has(descriptors, "_pre") && descriptors._pre.length) {
      // Root->Child
      wDoc["tags.subjectsFlatAdjectives." + rootNoun] = { $nin: descriptors._pre };
    } else {
      exclude.push(rootNoun);
    }
  });

  if (exclude.length) {
    // Root->Root exclusion
    wDoc["tags.subjectsFlat"] = { $nin: exclude };
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
      wDoc["tags.subjectsReverse." + rootNoun + "." + parent] = doc;
    });
  });
};

function queryGeneratorSubjects(parsed, extLookup, sDoc) {
  sDoc.$and = [];

  if (parsed.subjectsFlat.length) {
    /*
    This is the basic Root->Root query.
    All we're doing is checking for all root nouns existing.
    i.e. matching `dog` against `dog` or `dog: black, hat`
    */
    //sDoc["tags.subjectsFlat"] = { $all: parsed.subjectsFlat };
    pushApply(sDoc.$and, _.map(
      parsed.subjectsFlat,
      function (subj) {
        var exts = extLookup[subj];
        return { "tags.subjectsFlat": { $in: exts } };
      }
    ));
  }

  _.each(parsed.subjects, function (descriptors, rootNoun) {
    if (_.has(descriptors, "_pre") && descriptors._pre.length) {
      /*
      Root->Child: `blue hat` with `dog: black, blue hat`
      We only need to do this if there are pre-adjs.
      */
      //sDoc["tags.subjectsFlatAdjectives." + rootNoun] = { $all: descriptors._pre };
      pushApply(sDoc.$and, _.map(
        descriptors._pre,
        function (pre) {
          var rootExts = extLookup[rootNoun];
          var exts = extLookup[pre];
          var orDoc = { $or: [] };
          orDoc.$or = _.map(rootExts, function (rootExt) {
            var doc = {};
            doc["tags.subjectsFlatAdjectives." + rootExt] = { $in: exts };
            return doc;
          });
          return orDoc;
        },
      ));
    }
  });

  _.each(parsed.subjectsReverse, function (descriptors, rootNoun) {
    _.each(descriptors, function (adjectives, parent) {
      /*
      Child->Child: `dog: blue hat` with `dog: black, blue hat`
      */
      //var doc = { $exists: true };
      //if (! _.isEmpty(adjectives)) {
      //  doc.$all = adjectives;
      //}
      //sDoc["tags.subjectsReverse." + rootNoun + "." + parent] = doc;

      var rootExts = extLookup[rootNoun];
      var parentExts = extLookup[parent];

      var rootOrDoc = { $or: [] };
      _.each(rootExts, function (rootExt) {
        _.each(parentExts, function (parentExt) {
          if (! _.isEmpty(adjectives)) {
            pushApply(sDoc.$and, _.map(
              adjectives,
              function (adj) {
                var exts = extLookup[adj];
                var orDoc = { $or: [] };
                orDoc.$or = _.map(rootExts, function (rootExt) {
                  var doc = {};
                  doc["tags.subjectsReverse." + rootExt + "." + parentExt] = {
                    $in: exts
                  };
                  return doc;
                });
                return orDoc;
              }
            ));
          }

          rootDoc = {};
          rootDoc["tags.subjectsReverse." + rootExt + "." + parentExt] = { $exists: true };
          rootOrDoc.$or.push(rootDoc);
        });
      });
      pushApply(sDoc.$and, rootOrDoc);

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
  var queryDoc = {}, wDoc = {}, sDoc = {};

  var extLookup = _.reduce(
    parsed.allTags,
    function (result, tag) {
      result[tag] = tagExtensions(tag);
      return result;
    },
    {}
  );

  queryGeneratorAuthors(parsed, queryDoc);
  queryGeneratorOrigins(parsed, queryDoc);
  queryGeneratorMeta(parsed, queryDoc);
  queryGeneratorWithout(parsed, extLookup, wDoc);
  queryGeneratorSubjects(parsed, extLookup, sDoc);

  if (! _.isEmpty(wDoc) || ! _.isEmpty(sDoc)) {
    wAnd = wDoc.$and;
    delete wDoc.$and;
    sAnd = sDoc.$and;
    delete sDoc.$and;
    queryDoc.$and = [
      wDoc,
      sDoc
    ];
    queryDoc.$and = _.union(queryDoc.$and, wAnd, sAnd);
  }

  //prettyPrint(parsed);
  prettyPrint(queryDoc);

  return queryDoc;
};
