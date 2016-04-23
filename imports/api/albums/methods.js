import _ from "lodash";
import slug from "slug";

import Albums from "./collection";
import Posts from "../posts/collection";
import "../topics/methods";
import Topics from "../topics/collection";
import Notifications from "../notifications/collection";
import processMentions from "../common/processMentions";

const match = {
  name: String,
  posts: [String],
	visibility: String,
	description: String
};

// Intended to be used via _.map(posts, postInliner)
function postInliner(postId) {
  const post = Posts.findOne({ _id: postId });
  return _.pick(post, [name, owner, medium, visibility, safety]);
}

function mentions(albumId, data) {
  if (Meteor.isServer) {
    processMentions("album", data.description, {
      album: {
        _id: albumId,
        name: data.name
      }
    });
  }
}

Meteor.methods({
	addAlbum(data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		let topicId;
		if (Meteor.isServer) {
			topicId = Meteor.call("addTopic", Meteor.user().room._id, {
				name: data.name,
				visibility: data.visibility
			});
		}

		const albumId = Albums.insert(_.defaults({
      createdAt: new Date(),
			updatedAt: new Date(),
      slug: slug(data.name),
      owner: {
				_id: Meteor.userId(),
				username: Meteor.user().username,
				profile: Meteor.user().profile
			},
			topic: {
				_id: topicId
			}
    }, data));

		mentions(albumId, data);
	},
	updateAlbum(albumId, data) {
		check(albumId, String);
		check(data, match);

		const album = Albums.findOne(albumId);

		if (! isOwner(album)) {
			throw new Meteor.Error("not-authorized");
		}

		Albums.update(
			{ _id: albumId },
			{ $set: _.defaults({
        updatedAt: new Date(),
        slug: slug(data.name)
      }, data) }
		);

		Topics.update(
			{ _id: album.topic._id },
			{ $set: {
				visibility: data.visibility
			} }
		);

		mentions(albumId, data);
	},
	deleteAlbum: function (albumId) {
		check(albumId, String);

		const album = Albums.findOne(albumId);

		if (! isOwner(album)) {
			throw new Meteor.Error("not-authorized");
		}

		Albums.remove(albumId);
		Topics.remove({ _id: album.topic._id });
	}
});
