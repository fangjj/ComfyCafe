import _ from "lodash";

import Albums from "/imports/api/albums/collection";
import Posts from "/imports/api/posts/collection";
import "/imports/api/topics/methods";
import Topics from "/imports/api/topics/collection";
import Notifications from "/imports/api/notifications/collection";
import processMentions from "/imports/api/common/processMentions";
import createSlugCycler from "/imports/api/common/createSlugCycler";

const match = {
  name: String,
  posts: [String],
	visibility: String,
	description: String
};

const slugCycle = createSlugCycler(Albums);

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

    const slug = slugCycle(null, data.name);

		const albumId = Albums.insert(_.defaults({
      createdAt: new Date(),
			updatedAt: new Date(),
      slug: slug,
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

    const slug = slugCycle(albumId, data.name);

		Albums.update(
			{ _id: albumId },
			{ $set: _.defaults({
        updatedAt: new Date(),
        slug: slug
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
  albumAddPost(albumId, postId) {
    check(albumId, String);
    check(postId, String);

    const album = Albums.findOne(albumId);

    if (! isOwner(album)) {
      throw new Meteor.Error("not-authorized");
    }

    Albums.update(
      { _id: albumId },
      { $addToSet: {
        posts: postId
      } }
    );
  },
  albumRemovePost(albumId, postId) {
    check(albumId, String);
    check(postId, String);

    const album = Albums.findOne(albumId);

    if (! isOwner(album)) {
      throw new Meteor.Error("not-authorized");
    }

    Albums.update(
      { _id: albumId },
      { $pull: {
        posts: postId
      } }
    );
  },
	deleteAlbum(albumId) {
		check(albumId, String);

		const album = Albums.findOne(albumId);

		if (! isOwner(album)) {
			throw new Meteor.Error("not-authorized");
		}

		Albums.remove(albumId);
		Topics.remove({ _id: album.topic._id });
	}
});
