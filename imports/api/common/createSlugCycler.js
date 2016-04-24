import slugify from "slug";

function createSlugCycler(coll) {
  function slugCycle (id, name, i=0) {
    let postfixed = name;
    if (i > 0) {
      postfixed = name + "-" + i;
    }

    const slug = slugify(postfixed);

    // make sure slug isn't taken
    if (coll.findOne(
      {
        _id: { $ne: id }, // it doesn't count if it's the same item
        slug: slug,
        "owner._id": Meteor.userId() // slugs are namespaced
      }
    )) {
      return slugCycle(id, name, i+1);
    }

    return slug;
  }

  return slugCycle;
}

export default createSlugCycler;
