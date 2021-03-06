import _ from "lodash";

import Posts from "/imports/api/posts/collection";
import watcherDispatch from "/imports/api/messages/watcherDispatch";
import mentionDispatch from "/imports/api/messages/mentionDispatch";

function notificationDispatch(messageId, data, topic, isNew) {
  const root = _.reduce(
    [
      [Posts, "post"]
    ],
    (result, coll) => {
      const doc = coll[0].findOne({ "topic._id": topic._id });
      if (doc) {
        result = [doc, coll[1]];
      }
      return result;
    },
    null
  );

  const isComment = Boolean(root);

  if (isNew) {
    watcherDispatch(messageId, topic, root, isComment);
  }
  mentionDispatch(messageId, data, topic, root, isComment);
}

export default notificationDispatch;
