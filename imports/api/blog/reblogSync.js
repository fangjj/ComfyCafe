import _ from "lodash";

import prefixer from "/imports/api/common/prefixer";
import BlogPosts from "/imports/api/blog/collection";

function reblogSync(query, update) {
  BlogPosts.find(query).map((post) => {
    BlogPosts.update(
      { reblogData: { $elemMatch: { _id: post._id } } },
      _.mapValues(update, (subDoc, key) => {
        return prefixer("reblogData.$", subDoc);
      }),
      { multi: true }
    );
  });
}

export default reblogSync;
