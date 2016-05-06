import _ from "lodash";

import Posts from "../collection";
import { postsPerPage } from "../constants";
import privacyWrap from "/imports/api/common/privacyWrap";
import tagQuery from "/imports/api/tags/query";

function checkState(state) {
	check(state, Match.Optional(
		{
			originalOnly: Boolean,
			tagStr: String,
			filter: String
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

	if (state.tagStr) {
		const parsed = tagQuery(state.tagStr);
		_.each(parsed, (value, key) => {
			if (_.has(doc, key)) {
				if (_.includes(["$and", "$or", "$nor"], key)) {
					doc[key].push.apply(doc[key], value);
				} else {
					console.error("PANIC: key " + key + " already present in doc.");
				}
			} else {
				doc[key] = value;
			}
		});
	}

	if (state.filter) {
		if (state.filter === "all") {
			// noop
		}
		if (state.filter === "sfw") {
			doc["safety"] = { $lte: 1 };
		}
		if (state.filter === "nsfw") {
			doc["safety"] = { $gte: 2 };
		}
		if (state.filter === "your") {
			doc["owner._id"] = userId;
		}
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

Meteor.publish("post", function (username, postName) {
	check(username, String);
	check(postName, String);
	return Posts.find(
		{
			"owner.username": username,
			name: postName
		}
	);
});

Meteor.publish("allPosts", function (state, page=0) {
	checkState(state);
	check(page, Number);

	this.autorun(function (computation) {
		const doc = expr(() => {
		if (this.userId) {
				const user = Meteor.users.findOne(this.userId, { fields: {
					friends: 1
				} });

				return privacyWrap(
					{},
					this.userId,
					user.friends
				);
			} else {
				return { visibility: "public" };
			}
		});

		return Posts.find(
			queryBuilder(
				this.userId,
				doc,
				state
			),
			options(page)
		);
	});
});

Meteor.publish("imagesBy", function (username, state, page=0) {
	check(username, String);
	checkState(state);
	check(page, Number);

	this.autorun(function (computation) {
		const doc = expr(() => {
			if (this.userId) {
				const user = Meteor.users.findOne(this.userId, { fields: {
					friends: 1
				} });

				return privacyWrap(
					{ "owner.username": username },
					this.userId,
					user.friends
				);
			} else {
				return {
					"owner.username": username,
					visibility: "public"
				};
			}
		});

		return Posts.find(
			queryBuilder(
				this.userId,
				doc,
				state
			),
			options(page)
		);
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
				friends: 1
			} });

			return Posts.find(
				queryBuilder(
					this.userId,
					privacyWrap(
						{ $or: [
							{ "owner._id": this.userId },
							{ "owner._id": { $in: user.subscriptions || [] } }
						] },
						this.userId,
						user.friends
					),
					state
				),
				options(page)
			);
		}
	});
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

Meteor.publish("bookmarks", function (state, page=0) {
	checkState(state);
	check(page, Number);

	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				bookmarks: 1
			} });

			return Posts.find(
				queryBuilder(
					this.userId,
					{ _id: { $in: user.bookmarks || [] } },
					state
				),
				options(page)
			);
		}
	});
});

Meteor.publish("searchPosts", function (tagStr, state, page=0) {
	check(tagStr, String);
	checkState(state);
	check(page, Number);

	const query = tagQuery(tagStr);

	this.autorun(function (computation) {
		const doc = expr(() => {
			if (this.userId) {
				const user = Meteor.users.findOne(this.userId, { fields: {
					friends: 1
				} });
				return privacyWrap(query, this.userId, user.friends);
			} else {
				return privacyWrap(query);
			}
		});

		return Posts.find(
			queryBuilder(
				this.userId,
				doc,
				state
			),
			options(page)
		);
	});
});
