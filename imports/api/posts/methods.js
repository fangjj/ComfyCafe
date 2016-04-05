import _ from "lodash";

import Posts from "./collection";
import generateName from "./nameGen/generator";
import media from "../media/collection";
import "../topics/methods";
import Topics from "../topics/collection";
import Notifications from "../notifications/collection";
import processMentions from "../common/processMentions";
import tagParser from "../tags/parser";
import { tagFullResolver } from "../tags/resolver";

function nameCycle(options, callback) {
	var name = generateName(options);
	var taken = Boolean(Posts.findOne(
		{
			"owner._id": Meteor.userId(),
			name: name
		}
	));
	if (taken) {
		nameCycle(nsfw, callback);
	} else {
		callback(name);
	}
}

function injectAuthor(data, tags) {
	if (data.originality !== "repost") {
		var username = Meteor.user().username;
		if (! tags.authors) {
			tags.authors = [username];
		} else if (! _.has(tags.authors, username)) {
			tags.authors.push(username);
		}
	}
}

const match = {
	visibility: String,
	originality: String,
	source: String,
	description: String,
	safety: Number,
	tags: String,
	tagsCondExpanded: Object,
	pretentiousFilter: String
};

Meteor.methods({
	addPost: function (mediumId, data) {
		check(mediumId, String);
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

		var tags = tagParser(data.tags, {reformat: true});
		injectAuthor(data, tags);
		if (Meteor.isServer) {
			tags = tagFullResolver(tags);
		}

		var name;
		nameCycle({}, function (n) {
			name = n;

			var topicId;
			if (Meteor.isServer) {
				topicId = Meteor.call("addTopic", Meteor.user().room._id, {
					name: name,
					visibility: data.visibility
				});
			}

			var mediumDoc = {
				_id: medium._id,
				contentType: medium.contentType,
				md5: medium.md5
			};
			if (_.has(medium.metadata, "width")) {
				mediumDoc.width = medium.metadata.width;
				mediumDoc.height = medium.metadata.height;
			}

			var postId = Posts.insert(
				{
					createdAt: new Date(),
					updatedAt: new Date(),
					name: name,
					owner: {
						_id: Meteor.userId(),
						username: Meteor.user().username,
						profile: Meteor.user().profile
					},
					medium: mediumDoc,
					color: medium.metadata.color,
					complement: medium.metadata.complement,
					topic: {
						_id: topicId
					},
					visibility: data.visibility,
					originality: data.originality,
					source: data.source,
					description: data.description,
					safety: data.safety,
					tags: tags,
					tagsCondExpanded: data.tagsCondExpanded,
					pretentiousFilter: data.pretentiousFilter
				}
			);

			if (Meteor.isServer) {
				media.update(
					{ _id: new Mongo.ObjectID(mediumId) },
					{ $set: {
						"metadata.post": postId,
						"metadata.bound": true
					} }
				);

	      processMentions("post", data.description, {
	        post: {
	          _id: postId,
	          name: name
	        }
	      });
	    }
		});

		return name;
	},
	updatePost: function (postId, data) {
		check(postId, String);
		check(data, match);

		var post = Posts.findOne(postId);

		if (! isOwner(post)) {
			throw new Meteor.Error("not-authorized");
		}

		var tags = tagParser(data.tags, {reformat: true});
		injectAuthor(data, tags);
		if (Meteor.isServer) {
			tags = tagFullResolver(tags);
		}

		Posts.update(
			{ _id: postId },
			{ $set: {
				updatedAt: new Date(),
				visibility: data.visibility,
				originality: data.originality,
				source: data.source,
				description: data.description,
				safety: data.safety,
				tags: tags,
				tagsCondExpanded: data.tagsCondExpanded,
				pretentiousFilter: data.pretentiousFilter
			} }
		);

		Topics.update(
			{ _id: post.topic._id },
			{ $set: {
				visibility: data.visibility
			} }
		);

		if (Meteor.isServer) {
			processMentions("post", data.description, {
				post: {
					_id: postId,
					name: post.name
				}
			});
		}
	},
	deletePost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);

		if (! isOwner(post)) {
			throw new Meteor.Error("not-authorized");
		}

		Posts.remove(postId);
		media.remove({ "metadata.post": postId });
	},
	rerollPost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);
		var oldName = post.name;

		if (! isOwner(post)) {
			throw new Meteor.Error("not-authorized");
		}

		if (Meteor.isServer) {
			var name;
			nameCycle({}, function (n) {
				name = n;
				Posts.update(
					{ _id: postId },
					{ $set: {
						name: name
					} }
				);

				Topics.update(
					{ _id: post.topic._id },
					{ $set: {
						name: name
					} }
				);

				Notifications.update(
					{ "post._id": postId },
					{ $set: {
						"post.name": name
					} },
					{ multi: true }
				);
			});

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
	bookmarkPost: function (postId, state) {
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
		doc[key] = { bookmarks: postId };

		Meteor.users.update(
			{ _id: Meteor.userId() },
			doc
		);
	}
});
