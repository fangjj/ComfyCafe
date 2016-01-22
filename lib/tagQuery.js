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

  _.each(tagObj.nouns, function (rel, noun) {
    var done = false;

    if (slice(noun, 0, 3) === "id:") {
      // The query specifies a post ID, i.e. id:neJk82uvXvGH3Meig.
      queryDoc._id = slice(noun, 3, undefined);
      done = true;
    }

    if (! done && slice(noun, 0, 5) === "name:") {
      // The query specifies a post name, i.e. name:DuplicitousVibrantXamdou.
      queryDoc.name = slice(noun, 5, undefined);
      done = true;
    }

    if (! done) {
      /*
      Alright, before doing hardcore querying, we're going to eliminate all posts that don't
      at least have all the nouns we're looking for.
      */
      queryDoc["tags.nouns." + noun] = { $exists: true };

      // Now for the tricky stuff!

      if (! _.isEmpty(rel.root)) {
        /*
        If we enter this block, then this is a root noun, i.e. a character name.
        The data structure is simply an array of adjectives.
        ["big", "sassy", "black"]
        */

        /*
        This is a basic Root->Root query.
        All we're doing is checking for a root noun with all the specified adjectives.
        i.e. matching "black dog" against "black dog with hat"
        */
        queryDoc["tags.nouns." + noun + ".root"] = { $all: rel.root };

        /*
        Root->Child is a bit more complicated.
        i.e. matching "hat" against "black dog with hat"
        */

        /*
        try:
          post_parents = tag_dict['nouns'][noun]['parents']
          post_root = tag_dict['nouns'][noun]['root']
        except KeyError:
          # Attempt to match lone adjectives.
          if post.tags.get(name=noun):
            continue
          else:
            matched = False
            break

        if post_parents:
          # Root/Child
          # Now we want "dog" to return results for "man with dog".
          # This is much more liberal, since parents don't matter.

          for parent, post_adjectives in post_parents.items():
            matched = subset(adjectives, post_adjectives)

            # We only need one parent's adjectives to match,
            # regardless of the parent's noun.
            if matched:
              break
        */
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
          queryDoc["tags.nouns." + noun + ".parents." + parent] = { $all: adjectives };
        }

        /*
        for noun, rel in query_dict['nouns'].items():
          if rel['parents']:
            # For magical reasons, we mostly only care about child nouns.

            post_parents = tag_dict['nouns'][noun]['parents']

            if post_parents:
              # Child/Child
              # Noun is a child noun in the post.
              # Now we just have to compare the two.

              for parent, adjectives in rel['parents'].items():
                if parent in post_parents:
                  # The relationships match, now for adjectives!
                  post_adjectives = post_parents[parent]
                  matched = subset(adjectives, post_adjectives)

                else:
                  matched = False

                if not matched:
                  break

            else:
              # Child/Root
              # Noun is a root noun in the post.
              # This isn't a match, since it would be like searching
              # "man with dog" and getting results for "dog with man".
              matched = False
        */
      });

      done = true;
    }
  });

  console.log("================== QUERY ===================================");
  prettyPrint(queryDoc);

  var posts = Posts.find(queryDoc);

  console.log("================== RESULTS =================================");
  prettyPrint(posts.map(function (post) {
    return post.name;
  }));

  return posts;
};
/*
		# We filter first, since we can assume there are less filters.
		for noun, rel in query_dict['filters'].items():
			if rel['parents']:
				try:
					post_parents = tag_dict['nouns'][noun]['parents']
				except KeyError:
					# The post doesn't even have that noun, so it won't be KO'd.
					pass
				else:
					if post_parents:
						# Child/Child
						for parent, adjectives in rel['parents'].items():
							if parent in post_parents:
								post_adjectives = post_parents[parent]
								matched = not subset(adjectives,
									post_adjectives)

							if not matched:
								break

			else:
				try:
					post_parents = tag_dict['nouns'][noun]['parents']
					post_root = tag_dict['nouns'][noun]['root']
				except KeyError:
					pass
				else:
					adjectives = rel['root']

					if post_parents:
						# Root/Child

						for parent, post_adjectives in post_parents.items():
							matched = not subset(adjectives, post_adjectives)

							if not matched:
								break

					else:
						# Root/Root
						matched = not subset(adjectives, post_root)
*/
