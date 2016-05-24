import _ from "lodash";

import Albums from "/imports/api/albums/collection";
import Posts from "/imports/api/posts/collection";
import "/imports/api/topics/methods";
import Topics from "/imports/api/topics/collection";
import Notifications from "/imports/api/notifications/collection";
import processMentions from "/imports/api/common/processMentions";
import createSlugCycler from "/imports/api/common/createSlugCycler";
import docBuilder from "/imports/api/common/docBuilder";
import { isMod } from "/imports/api/common/persimmons";
import checkReason from "/imports/api/common/checkReason";
import ModLog from "/imports/api/modlog/collection";

const match = {
  name: String,
  posts: [String],
	visibility: String,
	description: String
};

const slugCycle = createSlugCycler(Albums);

function mentions(albumId, data) {
  if (Meteor.isServer) {
    processMentions("album", data.description, {
      album: {
        _id: albumId,
        slug: data.slug,
        name: data.name
      }
    });
  }
}

function updateAlbum(albumId, data, auth) {
  const album = Albums.findOne(albumId);

  auth(album);

  Albums.update(
    { _id: albumId },
    { $set: _.defaults({
      updatedAt: new Date()
    }, data) }
  );

  Topics.update(
    { _id: album.topic._id },
    { $set: {
      name: data.name,
      visibility: data.visibility
    } }
  );

  if (Meteor.isServer) {
    const slug = slugCycle(albumId, data.name);
    Albums.update(
      { _id: albumId },
      { $set: { slug } }
    );
    data.slug = slug;
    mentions(albumId, data);
    return slug;
  }
}

function deleteAlbum(albumId, auth) {
  const album = Albums.findOne(albumId);

  auth(album);

  Albums.remove(albumId);
  Topics.remove({ _id: album.topic._id });
  Meteor.users.update(
    { _id: Meteor.userId() },
    { $inc: { "profile.albumCount": -1 } }
  );

  return album;
}

Meteor.methods({
	addAlbum(data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		let topicId;
		if (Meteor.isServer) {
			topicId = Meteor.call("addTopic", Meteor.user().room._id, { name: data.name }, true);
		}

    data.slug = slugCycle(null, data.name);

		const albumId = Albums.insert(_.defaults({
      createdAt: new Date(),
			updatedAt: new Date(),
      owner: {
				_id: Meteor.userId(),
				username: Meteor.user().username,
        normalizedUsername: Meteor.user().normalizedUsername,
				profile: Meteor.user().profile
			},
			topic: {
				_id: topicId
			}
    }, data));

    Meteor.users.update(
      { _id: Meteor.userId() },
      { $inc: { "profile.albumCount": 1 } }
    );

		mentions(albumId, data);

    return data.slug;
	},
	updateAlbum(albumId, data) {
		check(albumId, String);
		check(data, match);
		return updateAlbum(albumId, data, (album) => {
      if (! isOwner(album)) {
        throw new Meteor.Error("not-authorized");
      }
    });
	},
  modUpdateAlbum(albumId, data, reason) {
		check(albumId, String);
		check(data, match);
		checkReason(reason);

		let owner;
		const slug = updateAlbum(albumId, data, (album) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}

			owner = album.owner;
		});

		const doc = docBuilder({
			item: {
				_id: albumId,
				ownerId: owner._id,
				type: "album",
				action: "updated",
				url: FlowRouter.path("album", {
					username: owner.username,
					albumSlug: slug
				})
			}
		}, reason);
		ModLog.insert(doc);
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
    deleteAlbum(albumId, (album) => {
      if (! isOwner(album)) {
        throw new Meteor.Error("not-authorized");
      }
    });
	},
  modDeleteAlbum(albumId, reason) {
		check(albumId, String);
		checkReason(reason);

		const album = deleteAlbum(albumId, (album) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}
		});

		const doc = docBuilder({
			item: {
				_id: albumId,
				ownerId: album.owner._id,
				type: "album",
				action: "deleted"
			}
		}, reason);
		ModLog.insert(doc);
	}
});
