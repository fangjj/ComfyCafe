/*
Okay, so the original query code was incomprehensible.
This time, I'm commenting it heavily. I promise!
*/

// True if hopefullySub's elements are also present in hopefullySuper.
subset = function (hopefullySub, hopefullySuper) {
  return hopefullySub.length === _.intersection(hopefullySub, hopefullySuper).length;
};

queryTags = function (tagStr) {
  // Parse tagStr if it isn't already parsed.
  var tagObj;
  if (typeof tagStr === "object") {
    tagObj = tagStr;
  } else {
    tagObj = parseTagStr(tagStr);
  }

  // So pretty!
  console.log("================== TAGS ====================================");
  prettyPrint(tagObj);

  var queryDoc = {};
  _.each(tagObj.nouns, function (rel, noun) {
    if (slice(noun, 0, 3) === "id:") {
      /*
      The query specifies a post ID, i.e. id:neJk82uvXvGH3Meig.
      Therefore, only one post could possibly match.
      */
      queryDoc._id = slice(noun, 3, undefined);
    } else {
      /*
      Alright, before doing hardcore querying, we're going to eliminate all posts that don't
      at least have all the top-level nouns we're looking for.
      */
      queryDoc["tags.nouns." + noun] = { $exists: true };
    }
  });

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

  console.log("================== QUERY ===================================");
  prettyPrint(queryDoc);

  var posts = Posts.find(queryDoc);

  console.log("================== RESULTS =================================");
  prettyPrint(posts.map(function (post) {
    return post.name;
  }));

  return posts;
};
