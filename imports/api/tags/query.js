import _ from "lodash";

import tagParser from "./parser";
import tagExtensions from "./extensions";

function queryGeneratorAuthors(parsed, queryDoc) {
  const and = [];

  // If we're querying for authors, only return posts with all of those authors.
  _.each(parsed.authors, (a) => {
    and.push({ $or: [
      { "tags.authors": a },
      { "owner.username": a },
      { "owner.normalizedUsername": a },
      { "owner.profile.displayName": a }
    ] });
  });

  if (parsed.notAuthors.length) {
    // If we're excluding some authors, don't return posts with any of those authors.
    and.push({ $or: [
      { "tags.authors": { $nin: parsed.notAuthors } },
      { "owner.username": { $nin: parsed.notAuthors } },
      { "owner.normalizedUsername": { $nin: parsed.notAuthors } },
      { "owner.profile.displayName": { $nin: parsed.notAuthors } }
    ] });
  }

  prettyPrint(and);
  return and;
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

function queryGeneratorSafeties(parsed, queryDoc) {
  var safetyQuery = {};
  if (parsed.safeties.length) {
    safetyQuery.$in = parsed.safeties;
  }
  if (! _.isEmpty(safetyQuery)) {
    queryDoc["safety"] = safetyQuery;
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

function queryGeneratorWithout(parsed, extLookup, wAnd) {
  var exclude = [];

  _.each(parsed.without, function (descriptors, rootNoun) {
    if (_.has(descriptors, "_pre") && descriptors._pre.length) {
      // Root->Child
      var rootExts = extLookup[rootNoun];
      _.each(descriptors._pre, function (dp) {
        var exts = extLookup[dp];
        pushApply(wAnd, _.map(
          rootExts,
          function (rootExt) {
            var doc = {};
            doc["tags.subjectsFlatAdjectives." + rootExt] = { $nin: exts };
            return doc;
          }
        ));
      });
    } else {
      exclude.push(rootNoun);
    }
  });

  if (exclude.length) {
    // Root->Root exclusion
    pushApply(wAnd, _.map(
      exclude,
      function (subj) {
        var exts = extLookup[subj];
        return { "tags.subjectsFlat": { $nin: exts } };
      }
    ));
  }

  _.each(parsed.withoutReverse, function (descriptors, rootNoun) {
    _.each(descriptors, function (adjectives, parent) {
      // Child->Child
      /*
      var doc = {};
      if (! _.isEmpty(adjectives)) {
        doc.$nin = adjectives;
      } else {
        doc.$exists = false;
      }
      wDoc["tags.subjectsReverse." + rootNoun + "." + parent] = doc;
      */

      var rootExts = extLookup[rootNoun];
      var parentExts = extLookup[parent];

      _.each(rootExts, function (rootExt) {
        _.each(parentExts, function (parentExt) {
          if (! _.isEmpty(adjectives)) {
            _.each(adjectives, function (adj) {
              var exts = extLookup[adj];
              pushApply(wAnd, _.map(
                rootExts,
                function (rootExt) {
                  var doc = {};
                  doc["tags.subjectsReverse." + rootExt + "." + parentExt] = {
                    $nin: exts
                  };
                  return doc;
                }
              ));
            });
          } else {
            var doc = {};
            doc["tags.subjectsReverse." + rootExt + "." + parentExt] = { $exists: false };
            wAnd.push(doc);
          }
        });
      });
    });
  });
};

function queryGeneratorSubjects(parsed, extLookup, sAnd) {
  if (parsed.subjectsFlat.length) {
    /*
    This is the basic Root->Root query.
    All we're doing is checking for all root nouns existing.
    i.e. matching `dog` against `dog` or `dog: black, hat`
    */
    pushApply(sAnd, _.map(
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
      pushApply(sAnd, _.map(
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

      var rootExts = extLookup[rootNoun];
      var parentExts = extLookup[parent];

      var rootOrDoc = { $or: [] };
      _.each(rootExts, function (rootExt) {
        _.each(parentExts, function (parentExt) {
          if (! _.isEmpty(adjectives)) {
            pushApply(sAnd, _.map(
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

          var rootDoc = {};
          rootDoc["tags.subjectsReverse." + rootExt + "." + parentExt] = { $exists: true };
          rootOrDoc.$or.push(rootDoc);
        });
      });
      pushApply(sAnd, rootOrDoc);

      /*
      Child->Root: `hat: dog` with `dog: hat`
      We don't support this, for obvious reasons...
      */
    });
  });
}

function tagQuery(str) {
  if (! str) {
    return {};
  }

  let parsed = str;
  if (_.isString(str)) {
    parsed = tagParser(str);
  }
  let queryDoc = {}, wAnd = [], sAnd = [];

  prettyPrint(parsed);

  const extLookup = _.reduce(
    parsed.allTags,
    function (result, tag) {
      result[tag] = tagExtensions(tag);
      return result;
    },
    {}
  );

  queryGeneratorOrigins(parsed, queryDoc);
  queryGeneratorSafeties(parsed, queryDoc);
  queryGeneratorMeta(parsed, queryDoc);
  queryGeneratorWithout(parsed, extLookup, wAnd);
  queryGeneratorSubjects(parsed, extLookup, sAnd);

  const and = [];
  pushApply(and, queryGeneratorAuthors(parsed, queryDoc));
  pushApply(and, wAnd);
  pushApply(and, sAnd);
  if (and.length) {
    queryDoc.$and = and;
  }

  return queryDoc;
}

export default tagQuery;
