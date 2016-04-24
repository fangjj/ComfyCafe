import _ from "lodash";
import slugify from "slug";

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

function slugCycle(albumId, name, i=0) {
  let postfixed = name;
  if (i > 0) {
    postfixed = name + "-" + i;
  }

  const slug = slugify(postfixed);

  if (Albums.findOne(
    {
      _id: { $ne: albumId },
      slug: slug
    }
  )) {
    return slugCycle(albumId, name, i+1);
  }

  return slug;
}

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
