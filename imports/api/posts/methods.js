import _ from "lodash";

import Posts from "./collection";
import generateName from "./nameGen/generator";
import media from "/imports/api/media/collection";
import colors from "/imports/api/media/colors";
import "/imports/api/topics/methods";
import Topics from "/imports/api/topics/collection";
import Notifications from "/imports/api/notifications/collection";
import docBuilder from "/imports/api/common/docBuilder";
import processMentions from "/imports/api/common/processMentions";
import tagParser from "/imports/api/tags/parser";
import { tagFullResolver } from "/imports/api/tags/resolver";
import { regenThumbs } from "/imports/api/media/methods";
import { isMod } from "/imports/api/common/persimmons";
import checkReason from "/imports/api/common/checkReason";
import ModLog from "/imports/api/modlog/collection";

function nameCycle() {
	const name = generateName();
	const taken = Boolean(Posts.findOne(
		{
			"owner._id": Meteor.userId(),
			name: name
		}
	));
	if (taken) {
		return nameCycle();
	} else {
		return name;
	}
}

function validateColor(color) {
	if (_.includes(colors, color)) {
		return color;
	} return null;
}

const match = {
	visibility: String,
	originality: String,
	source: String,
	description: String,
	safety: Number,
	tags: String,
	tagsCondExpanded: Object,
	bgColor: String
};

function updatePost(postId, data, auth) {
	const post = Posts.findOne(postId);

	auth(post);

	let tags = tagParser(data.tags, {reformat: true});
	if (Meteor.isServer) {
		tags = tagFullResolver(tags);
	}

	data.bgColor = validateColor(data.bgColor);

	Posts.update(
		{ _id: postId },
		{ $set: _.defaults({
			updatedAt: new Date(),
			tags
		}, data) }
	);

	Topics.update(
		{ _id: post.topic._id },
		{ $set: { visibility: data.visibility } }
	);

	if (Meteor.isServer) {
		processMentions("post", data.description, {
			post: {
				_id: postId,
				name: post.name
			}
		});
	}

	return post;
}

function deletePost(postId, auth) {
	const post = Posts.findOne(postId);

	auth();

	Posts.remove(postId);
	media.remove({ "metadata.post": postId });
	Topics.remove({ _id: post.topic._id });
	Meteor.users.update(
		{ _id: Meteor.userId() },
		{ $inc: { "profile.imageCount": -1 } }
	);

	return post;
}

Meteor.methods({
	addPost(mediumId, data) {
		check(mediumId, String);
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (Meteor.isServer) {
			const name = nameCycle();

			const medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

			if (! medium) {
				throw new Meteor.Error("nonexistent-medium", "Medium " + mediumId + " doesn't exist.");
			}
			if (medium.length === 0) {
				throw new Meteor.Error("empty-medium", "Medium " + mediumId + " has length 0.");
			}
			if (medium.metadata.bound) {
				throw new Meteor.Error("duplicate-medium", "Medium " + mediumId + " is already bound.");
			}
			if (! medium.metadata.complete) {
				throw new Meteor.Error("incomplete-medium", "Medium " + mediumId + " isn't complete.");
			}

			let tags = tagParser(data.tags, {reformat: true});
			if (Meteor.isServer) {
				tags = tagFullResolver(tags);
			}

			let topicId;
			if (Meteor.isServer) {
				topicId = Meteor.call("addTopic", Meteor.user().room._id, { name }, true);
			}

			const mediumDoc = {
				_id: medium._id,
				contentType: medium.contentType,
				md5: medium.md5,
				thumbsComplete: _.get(medium.metadata, "thumbsComplete", []),
				thumbsTerminated: _.get(medium.metadata, "thumbsTerminated", [])
			};
			if (_.has(medium.metadata, "width")) {
				mediumDoc.width = medium.metadata.width;
				mediumDoc.height = medium.metadata.height;
			}

			data.bgColor = validateColor(data.bgColor);

			const doc = docBuilder({
				name,
				medium: mediumDoc,
				color: medium.metadata.color,
				complement: medium.metadata.complement,
				topic: {
					_id: topicId
				},
				tags
			}, data);
			const postId = Posts.insert(doc);

			const moid = new Mongo.ObjectID(mediumId);
			media.update(
				{ $or: [
					{ _id: moid },
					{ "metadata.thumbOf": moid },
				] },
				{ $set: {
					"metadata.post": postId,
					"metadata.bound": true
				} },
				{ multi: true }
			);

			Meteor.users.update(
				{ _id: Meteor.userId() },
				{ $inc: { "profile.imageCount": 1 } }
			);

      processMentions("post", data.description, {
        post: {
          _id: postId,
          name: name
        }
      });

			return name;
    }
	},
	updatePost(postId, data) {
		check(postId, String);
		check(data, match);
		updatePost(postId, data, (post) => {
			if (! isOwner(post)) {
				throw new Meteor.Error("not-authorized");
			}
		});
	},
	modUpdatePost(postId, data, reason) {
		check(postId, String);
		check(data, match);
		checkReason(reason);

		const post = updatePost(postId, data, (post) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}
		});

		const doc = docBuilder({
			item: {
				_id: postId,
				ownerId: post.owner._id,
				type: "image",
				action: "updated",
				url: FlowRouter.path("post", {
					username: post.owner.username,
					postName: post.name
				})
			}
		}, reason);
		ModLog.insert(doc);
	},
	deletePost(postId) {
		check(postId, String);
		deletePost(postId, (post) => {
			if (! isOwner(post)) {
				throw new Meteor.Error("not-authorized");
			}
		});
	},
	modDeletePost(postId, reason) {
		check(postId, String);
		checkReason(reason);

		const post = deletePost(postId, (post) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}
		});

		const doc = docBuilder({
			item: {
				_id: postId,
				ownerId: post.owner._id,
				type: "image",
				action: "deleted"
			}
		}, reason);
		ModLog.insert(doc);
	},
	rerollPost(postId) {
		check(postId, String);

		const post = Posts.findOne(postId);
		const oldName = post.name;

		if (! isOwner(post)) {
			throw new Meteor.Error("not-authorized");
		}

		if (Meteor.isServer) {
			const name = nameCycle();

			Posts.update(
				{ _id: postId },
				{ $set: {
					name: name
				} }
			);

			Topics.update(
				{ _id: post.topic._id },
				{ $set: {
					name,
					slug: name
				} }
			);

			Notifications.update(
				{ "post._id": postId },
				{ $set: {
					"post.name": name
				} },
				{ multi: true }
			);

			return name;
		}
	},
	likePost: function (postId, state) {
		check(postId, String);
		check(state, Boolean);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var key;
		if (state) {
			key = "$addToSet";
		} else {
			key = "$pull";
		}

		var doc = {};
		doc[key] = { likes: Meteor.userId() };

		Posts.update(
			{ _id: postId },
			doc
		);

		if (state) {
			var post = Posts.findOne({ _id: postId });
			Notifications.insert(
				{
					createdAt: new Date(),
					to: post.owner._id,
					action: "postLiked",
					owner: {
						_id: Meteor.userId(),
						username: Meteor.user().username,
						profile: Meteor.user().profile
					},
					post: {
						_id: postId,
						name: post.name
					}
				}
			);
		} else {
			Notifications.remove(
				{
					action: "postLiked",
					"owner._id": Meteor.userId(),
					"post._id": postId
				}
			);
		}
	},

	modRegenPostThumbs(postId) {
		check(postId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (! isMod(Meteor.userId())) {
			throw new Meteor.Error("not-authorized");
		}

		const post = Posts.findOne({ _id: postId });
		regenThumbs(post.medium._id, () => true);
	}
});
