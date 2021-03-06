import _ from "lodash";
import slugify from "slug";

function createSlugCycler(coll, noScope) {
  function slugCycle (id, name, obj, i=0) {
    let postfixed = name;
    if (! name) {
      name = i;
      postfixed = name;
    } else if (i > 0) {
      postfixed = name + "-" + i;
    }

    const slug = slugify(postfixed);

    const doc = {
      _id: { $ne: id }, // it doesn't count if it's the same item
      slug: slug
    };
    if (! noScope) {
      doc["owner._id"] = Meteor.userId(); // slugs are namespaced
    }
    if (obj) {
      const pair = _.toPairs(obj)[0];
      doc[pair[0]] = pair[1];
    }

    // make sure slug isn't taken
    if (coll.findOne(doc)) {
      return slugCycle(id, name, obj, i+1);
    }

    return slug;
  }

  return slugCycle;
}

export default createSlugCycler;
