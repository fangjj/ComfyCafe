import _ from "lodash";

import BlogPosts from "/imports/api/blog/collection";
import "/imports/api/topics/methods";
import Topics from "/imports/api/topics/collection";
import prefixer from "/imports/api/common/prefixer";
import processMentions from "/imports/api/common/processMentions";
import createSlugCycler from "/imports/api/common/createSlugCycler";
import docBuilder from "/imports/api/common/docBuilder";
import { isMod } from "/imports/api/common/persimmons";
import checkReason from "/imports/api/common/checkReason";
import ModLog from "/imports/api/modlog/collection";

const match = {
	name: String,
	visibility: String,
	body: String
};

const slugCycle = createSlugCycler(BlogPosts);

function mentions(postId, data) {
  if (Meteor.isServer) {
    processMentions("blog", data.body, {
      page: {
        _id: postId,
        slug: data.slug,
        name: data.name
      }
    });
  }
}

function updateBlogPost(postId, data, auth) {
	const post = BlogPosts.findOne(postId);

	auth(post);

	const doc = _.defaults({
		updatedAt: new Date()
	}, data);
	BlogPosts.update(
		{ _id: postId },
		{ $set: doc }
	);
	BlogPosts.update(
		{ "reblogOf._id": postId },
		{ $set: _.omit(prefixer("reblogOf", doc), [ "slug" ]) }
	);

	Topics.update(
		{ _id: post.topic._id },
		{ $set: {
			name: data.name,
			visibility: data.visibility
		} }
	);

	mentions(postId, data);

	if (Meteor.isServer) {
		const slug = slugCycle(postId, data.name);
		BlogPosts.update(
			{ _id: postId },
			{ $set: { slug } }
		);
		return slug;
	}
}

function deleteBlogPost(postId, auth) {
	const post = BlogPosts.findOne(postId);

	auth(postId);

	BlogPosts.remove(
		{ $or: [
			{ _id: postId },
			{ "reblogOf._id": postId }
		] }
	);
	Topics.remove({ _id: post.topic._id });
	Meteor.users.update(
    { _id: Meteor.userId() },
    { $inc: { "profile.blogCount": -1 } }
  );

	const reblogId = _.get(post, "reblogOf._id");
	if (reblogId) {
		BlogPosts.update(
			{ _id: reblogId },
			{ $inc: { reblogCount: -1 } }
		);
	}

	return post;
}

Meteor.methods({
	addBlogPost(data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		let topicId;
		if (Meteor.isServer) {
			topicId = Meteor.call("addTopic", Meteor.user().room._id, { name: data.name }, true);
		}

		data.slug = slugCycle(null, data.name);

		const doc = docBuilder({
			topic: {
				_id: topicId
			}
		}, data);
		const postId = BlogPosts.insert(doc);

		Meteor.users.update(
      { _id: Meteor.userId() },
      { $inc: { "profile.blogCount": 1 } }
    );

		mentions(postId, data);
	},
	updateBlogPost: function (postId, data) {
		check(postId, String);
		check(data, match);

		return updateBlogPost(postId, data, (post) => {
			if (! isOwner(post)) {
				throw new Meteor.Error("not-authorized");
			}
		});
	},
	modUpdateBlogPost(postId, data, reason) {
		check(postId, String);
		check(data, match);
		checkReason(reason);

		let owner;
		const slug = updateBlogPost(postId, data, (post) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}

			owner = post.owner;
		});

		const doc = docBuilder({
			item: {
				_id: postId,
				ownerId: owner._id,
				type: "blog",
				action: "updated",
				url: FlowRouter.path("blogPost", {
					username: owner.username,
					slug
				})
			}
		}, reason);
		ModLog.insert(doc);
	},
	deleteBlogPost(postId) {
		check(postId, String);
		deleteBlogPost(postId, (post) => {
			if (! isOwner(post)) {
				throw new Meteor.Error("not-authorized");
			}
		});
	},
	modDeleteBlogPost(postId, reason) {
		check(postId, String);
		checkReason(reason);

		const post = deleteBlogPost(postId, (post) => {
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
				type: "blog",
				action: "deleted"
			}
		}, reason);
		ModLog.insert(doc);
	},
	
	addReblog(reblogId, body) {
		check(reblogId, String);
		check(body, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const post = BlogPosts.findOne({ _id: reblogId });
		if (! post) {
			throw new Meteor.Error("existential-crisis");
		}

		// Only public posts can be reblogged. (unless it's your post; then I don't care)
		if (post.visibility !== "public" && post.owner._id !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		const doc = docBuilder({ body }, _.pick(post, [ "name", "visibility", "topic" ]));
		doc.slug = slugCycle(null, doc.name);
		doc.reblogOf = post;
		BlogPosts.insert(doc);
		BlogPosts.update(
			{ _id: post._id },
			{ $inc: { reblogCount: 1 } }
		);

		return doc.slug;
	},
	updateReblog(postId, body) {
		check(postId, String);
		check(body, String);

		const post = BlogPosts.findOne({ _id: postId });

		if (! isOwner(post)) {
			throw new Meteor.Error("not-authorized");
		}

		BlogPosts.update(
			{ _id: postId },
			{ $set: { body } }
		);
	}
});
