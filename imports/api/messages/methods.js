import _ from "lodash";

import "/imports/api/topics/methods";
import Messages from "/imports/api/messages/collection";
import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import Posts from "/imports/api/posts/collection";
import Albums from "/imports/api/albums/collection";
import Pages from "/imports/api/pages/collection";
import BlogPosts from "/imports/api/blog/collection";
import Notifications from "/imports/api/notifications/collection";
import processMentions from "/imports/api/common/processMentions";

Meteor.methods({
  addMessage: function (topicId, data) {
    check(topicId, String);
    check(data, {
      body: String
    });

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    const topic = Topics.findOne(topicId);

    const messageId = Messages.insert({
      createdAt: new Date(),
      updatedAt: new Date(),
      body: data.body,
      owner: {
        _id: Meteor.userId(),
        username: Meteor.user().username,
        normalizedUsername: Meteor.user().normalizedUsername,
        profile: Meteor.user().profile
      },
      topic: {
        _id: topicId,
        slug: topic.slug,
        room: {
          _id: topic.room._id,
          slug: topic.room.slug
        }
      }
    });

    if (Meteor.user().settings.autoWatch) {
      Meteor.call("watchTopic", topicId);
    }

    Topics.update(
      { _id: topicId },
      { $set: {
        lastActivity: new Date()
      }, $inc: {
        messageCount: 1
      } }
    );

    Rooms.update(
      { _id: topic.room._id },
      { $set: {
        lastActivity: new Date()
      } }
    );

    const root = _.reduce(
      [
        [Posts, "post"],
        [Albums, "album"],
        [Pages, "page"],
        [BlogPosts, "blog"]
      ],
      (result, coll) => {
        const doc = coll[0].findOne({ "topic._id": topicId });
        if (doc) {
          result = [doc, coll[1]];
        }
        return result;
      },
      null
    );

    const isComment = Boolean(root);

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
            _id: topicId,
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
            },
            album(item) {
              doc.action = "albumCommented";
              doc.album = {
                _id: item._id,
                name: item.name,
                slug: item.slug,
                username: item.owner.username
              };
            },
            page(item) {
              doc.action = "pageCommented";
              doc.page = {
                _id: item._id,
                name: item.name,
                slug: item.slug,
                username: item.owner.username
              };
            },
            blog(item) {
              doc.action = "blogCommented";
              doc.blog = {
                _id: item._id,
                name: item.name,
                slug: item.slug,
                username: item.owner.username
              };
            }
          };
          commentedMap[root[1]](root[0]);
        }

        Notifications.insert(doc);
      }
    });

    if (Meteor.isServer) {
      var label;
      var doc = {
        message: {
          _id: messageId
        }
      };

      if (! isComment) {
        label = "topic";
        doc.topic = {
          _id: topicId,
          name: topic.name,
          slug: topic.slug,
          room: {
            _id: topic.room._id,
            name: topic.room.name,
            slug: topic.room.slug
          }
        };
      } else {
        const mentionedMap = {
          post(item) {
            label = "postComment";
            doc.post = {
              _id: item._id,
              name: item.name,
              username: item.owner.username
            };
          },
          album(item) {
            label = "albumComment";
            doc.album = {
              _id: item._id,
              name: item.name,
              slug: item.slug,
              username: item.owner.username
            };
          },
          page(item) {
            label = "pageComment";
            doc.page = {
              _id: item._id,
              name: item.name,
              slug: item.slug,
              username: item.owner.username
            };
          },
          blog(item) {
            label = "blogComment";
            doc.blog = {
              _id: item._id,
              name: item.name,
              slug: item.slug,
              username: item.owner.username
            };
          }
        };
        mentionedMap[root[1]](root[0]);
      }

      processMentions(label, data.body, doc);
    }
  },
  updateMessage: function (messageId, data) {
    check(messageId, String);
    check(data, {
      body: String
    });

    const msg = Messages.findOne(messageId);

    if (! isOwner(msg)) {
			throw new Meteor.Error("not-authorized");
		}

    Messages.update(
      { _id: messageId },
      { $set: {
        updatedAt: new Date(),
        body: data.body
      } }
    );

    Topics.update(
      { _id: msg.topic._id },
      { $set: {
        lastActivity: new Date()
      } }
    );

    var topic = Topics.findOne(msg.topic._id);

    Rooms.update(
      { _id: topic.room._id },
      { $set: {
        lastActivity: new Date()
      } }
    );

    if (Meteor.isServer) {
      processMentions("topic", data.body, {
        message: {
          _id: messageId
        },
        topic: {
          _id: topic._id,
          name: topic.name,
          room: {
            _id: topic.room._id,
            name: topic.room.name
          }
        }
      });
    }
  },
  deleteMessage: function (messageId) {
    check(messageId, String);

    var msg = Messages.findOne(messageId);

    if (! isOwner(msg)) {
			throw new Meteor.Error("not-authorized");
		}

    Messages.remove(messageId);

    Topics.update(
      { _id: msg.topic._id },
      { $set: {
        lastActivity: new Date(),
      }, $inc: {
        messageCount: -1
      } }
    );

    var topic = Topics.findOne(msg.topic._id);

    Rooms.update(
      { _id: topic.room._id },
      { $set: {
        lastActivity: new Date()
      } }
    );
  }
});
