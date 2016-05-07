import _ from "lodash";

import BlogPosts from "/imports/api/blog/collection";
import "/imports/api/topics/methods";
import Topics from "/imports/api/topics/collection";
import processMentions from "/imports/api/common/processMentions";
import createSlugCycler from "/imports/api/common/createSlugCycler";

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

Meteor.methods({
	addBlogPost: function (data) {
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

		data.slug = slugCycle(null, data.name);

		const postId = BlogPosts.insert(_.defaults({
			createdAt: new Date(),
			updatedAt: new Date(),
			owner: {
				_id: Meteor.userId(),
				username: Meteor.user().username,
				profile: Meteor.user().profile
			},
			topic: {
				_id: topicId
			}
		}, data));

		mentions(postId, data);
	},
	updateBlogPost: function (postId, data) {
		check(postId, String);
		check(data, match);

		const post = BlogPosts.findOne(postId);

		if (! isOwner(post)) {
			throw new Meteor.Error("not-authorized");
		}

		BlogPosts.update(
			{ _id: postId },
			{ $set: _.defaults({
        updatedAt: new Date()
      }, data) }
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
	},
	deleteBlogPost: function (postId) {
		check(postId, String);

		const post = BlogPosts.findOne(postId);

		if (! isOwner(post)) {
			throw new Meteor.Error("not-authorized");
		}

		BlogPosts.remove(postId);
		Topics.remove({ _id: post.topic._id });
	}
});
