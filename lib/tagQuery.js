/*
Okay, so the original query code was incomprehensible.
This time, I'm commenting it heavily. I promise!
*/

var queryGenerator = function (queryDoc, coll, positive) {
  // These determine whether we're matching or filtering. postiive = matching
  var rootMode;
  var childMode;
  if (positive) {
    rootMode = "$or";
    childMode = "$all";
  } else {
    rootMode = "$nor";
    childMode = "$nin";
  }

  _.each(coll, function (rel, noun) {
    var done = false;

    if (slice(noun, 0, 3) === "id:") {
      // The query specifies a post ID, i.e. id:neJk82uvXvGH3Meig.
      var id = slice(noun, 3, undefined);
      if (positive) {
        queryDoc._id = id;
      } else {
        queryDoc._id = { $ne: id };
      }
      done = true;
    }

    if (! done && slice(noun, 0, 5) === "name:") {
      // The query specifies a post name, i.e. name:DuplicitousVibrantXamdou.
      var name = slice(noun, 5, undefined);
      if (positive) {
        queryDoc.name = name;
      } else {
        queryDoc.name = { $ne: name };
      }
      done = true;
    }

    if (! done) {
      /*
      Alright, before doing hardcore querying, we're going to eliminate all posts that don't
      at least have all the nouns we're looking for.
      */
      if (positive) {
        queryDoc["tags.nouns." + noun] = { $exists: true };
      } else if (_.isEmpty(rel.root)) {
        /*
        "dog without blue hat" is more specific than this, but also doesn't care wtherer or not
        "hat" is even present.
        However, "dog without hat" is more general, and would be unhappy with any hat at all.
        */
        queryDoc["tags.nouns." + noun] = { $exists: false };
      }

      // Now for the tricky stuff!

      if (! _.isEmpty(rel.root)) {
        /*
        If we enter this block, then this is a root noun, i.e. a character name.
        The data structure is simply an array of adjectives.
        ["big", "sassy", "black"]
        */

        var rootDoc = {};

        /*
        This is a basic Root->Root query.
        All we're doing is checking for a root noun with all the specified adjectives.
        i.e. matching "black dog" against "black dog with hat"
        */
        rootDoc["tags.nouns." + noun + ".root"] = { $all: rel.root };

        /*
        Root->Child is a bit more complicated.
        i.e. matching "blue hat" against "black dog with blue hat"

        Note that in the absence of adjectives, this works by default.
        But if we had no adjectives, we wouldn't have even entered this block.
        */
        rootDoc["tags.nouns." + noun + ".flatAdjectives"] = { $all: rel.root };

        // Now to $or together Root->Root and Root->Child.
        queryDoc[rootMode] = _.map(rootDoc, function (value, key) {
          var kv = {};
          kv[key] = value;
          return kv;
        });
      }

      _.each(rel.parents, function (adjectives, parent) {
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
          queryDoc["tags.nouns." + noun + ".parents." + parent] = {};
          queryDoc["tags.nouns." + noun + ".parents." + parent][childMode] = adjectives;
        }

        /*
        And last but not least, Child->Root.
        Actually, this is least, since we don't support it!
        i.e. matching "hat with dog" against "dog with hat"
        So enjoy the no-op.
        */
      });

      done = true;
    }
  });
};

queryTags = function (tagStr) {
  // Parse tagStr if it isn't already parsed.
  var tagObj;
  if (typeof tagStr === "object") {
    tagObj = tagStr;
  } else {
    tagObj = parseTagStr(tagStr);
  }

  if (! tagObj) {
    tagObj = {};
  }

  // So pretty!
  console.log("================== TAGS ====================================");
  prettyPrint(tagObj);

  var queryDoc = { private: false };

  authorQuery = {};
  if (tagObj.authors) {
    // If we're querying for authors, only return posts with all of those authors.
    authorQuery.$all = tagObj.authors;
  }
  if (tagObj.filteredAuthors) {
    // If we're excluding some authors, don't return posts with any of those authors.
    authorQuery.$nin = tagObj.filteredAuthors;
  }
  if (! _.isEmpty(authorQuery)) {
    queryDoc["tags.authors"] = authorQuery;
  }

  // Now we're ready for the meat of the query.
  // We're passing false, since this is the stuff we don't want to match.
  queryGenerator(queryDoc, tagObj.filters, false);
  // This takes true, since we want to match these.
  queryGenerator(queryDoc, tagObj.nouns, true);

  console.log("================== QUERY ===================================");
  prettyPrint(queryDoc);

  var posts = Posts.find(queryDoc, { sort: { createdAt: -1, name: 1 } });

  console.log("================== RESULTS =================================");
  prettyPrint(posts.map(function (post) {
    return post.tags.text;
  }));

  return posts;
};
