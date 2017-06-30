import _ from "lodash";

import Notifications from "/imports/api/notifications/collection";

function watcherDispatch(messageId, topic, root, isComment) {
  _.each(topic.watchers, function (watcherId) {
    if (watcherId !== Meteor.userId()) {
      const doc = {
        createdAt: new Date(),
        to: watcherId,
        message: { _id: messageId },
        owner: {
          _id: Meteor.userId(),
          username: Meteor.user().username,
          profile: Meteor.user().profile
        }
      };

      if (! isComment) {
        doc.action = "topicPosted";
        doc.topic = {
          _id: topic._id,
          name: topic.name,
          slug: topic.slug,
          room: {
            _id: topic.room._id,
            name: topic.room.name,
            slug: topic.room.slug
          }
        };
      } else {
        const commentedMap = {
          post(item) {
            doc.action = "postCommented";
            doc.post = {
              _id: item._id,
              name: item.name,
              username: item.owner.username
            };
          }
        };
        commentedMap[root[1]](root[0]);
      }

      Notifications.insert(doc);
    }
  });
}

export default watcherDispatch;
