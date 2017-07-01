import _ from "lodash";

import Posts from "../collection";
import { postsPerPage } from "../constants";
import privacyWrap from "/imports/api/common/privacyWrap";
import { isMod } from "/imports/api/common/persimmons";

Meteor.startup(function () {
	Posts._ensureIndex({
		"owner._id": 1,
		"owner.normalizedUsername": 1,
		name: 1,
		published: 1,
		originality: 1
	});
});

function checkState(state) {
	check(state, Match.Optional(
		{
			originalOnly: Boolean
		}
	));
}

function queryBuilder(userId, doc, state) {
	if (! state) {
		return doc;
	}

	if (state.originalOnly) {
		doc.originality = { $ne: "repost" };
	}

	return doc;
}

function options(page) {
	return {
		sort: { createdAt: -1, name: 1 },
		limit: (page + 1) * postsPerPage
	};
}

Meteor.publish("postPerma", function (postId) {
	check(postId, String);
	return Posts.find({ _id: postId });
});

Meteor.publish("post", function (name) {
	check(name, String);
	return Posts.find({ name });
});

Meteor.publish("postColor", function (name) {
	check(name, String);
	// We unfortunately have to publish owner in its entirety (thanks mergebox)
	return Posts.find(
		{ name },
		{ fields: { name: 1, bgColor: 1, complement: 1, owner: 1 } }
	);
});

Meteor.publish("allPosts", function (state, page=0) {
	checkState(state);
	check(page, Number);

	this.autorun(function (computation) {
		let user;
		const doc = expr(() => {
			if (this.userId) {
				user = Meteor.users.findOne(this.userId, { fields: {
					blocking: 1
				} });

				return privacyWrap(
					{},
					this.userId,
					undefined,
					user.blocking
				);
			} else {
				return { published: true };
			}
		});

		const query = queryBuilder(
			this.userId,
			doc,
			state
		);

		return Posts.find(query, options(page));
	});
});

Meteor.publish("imagesBy", function (username, state, page=0) {
	check(username, String);
	checkState(state);
	check(page, Number);

	this.autorun(function (computation) {
		let user;
		const doc = expr(() => {
			if (this.userId) {
				user = Meteor.users.findOne(this.userId, { fields: {
					blocking: 1
				} });

				return privacyWrap(
					{ "owner.username": username },
					this.userId,
					undefined,
					user.blocking
				);
			} else {
				return {
					"owner.username": username,
					published: true
				};
			}
		});

		const query = queryBuilder(
			this.userId,
			doc,
			state
		);

		return Posts.find(query, options(page));
	});
});

Meteor.publish("postFeed", function (state, page=0) {
	checkState(state);
	check(page, Number);

	//Meteor._sleepForMs(250);

	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				subscriptions: 1,
				blocking: 1
			} });

			const query = queryBuilder(
				this.userId,
				privacyWrap(
					{ $or: [
						{ "owner._id": this.userId },
						{ "owner._id": { $in: _.get(user, "subscriptions", []) } }
					] },
					this.userId,
					undefined,
					user.blocking
				),
				state
			);

			return Posts.find(query, options(page));
		}
	});

	this.ready();
});

Meteor.publish("likes", function (state, page=0) {
	checkState(state);
	check(page, Number);

	if (this.userId) {
		return Posts.find(
			queryBuilder(
				this.userId,
				{ likes: this.userId },
				state
			),
			options(page)
		);
	}
});

Meteor.publish("searchPosts", function (tagStr, state, page=0) {
	check(tagStr, String);
	checkState(state);
	check(page, Number);

	const innerQuery = tagQuery(tagStr);

	this.autorun(function (computation) {
		let user;
		const doc = expr(() => {
			if (this.userId) {
				user = Meteor.users.findOne(this.userId, { fields: {
					blocking: 1
				} });
				return privacyWrap(innerQuery, this.userId, undefined, user.blocking);
			} else {
				return privacyWrap(innerQuery);
			}
		});

		const query = queryBuilder(
			this.userId,
			doc,
			state
		);

		return Posts.find(query, options(page));
	});
});

Meteor.publish("modAllPosts", function () {
	if (isMod(this.userId)) {
  	return Posts.find({});
	}
});

Meteor.publish("modPost", function (postId) {
  check(postId, String);
	if (isMod(this.userId)) {
		return Posts.find({ _id: postId });
	}
});
