import _ from "lodash";

import Posts from "../collection";
import { postsPerPage } from "../constants";
import privacyWrap from "/imports/api/common/privacyWrap";
import Filters from "/imports/api/filters/collection";
import tagQuery from "/imports/api/tags/query";
import Albums from "/imports/api/albums/collection";
import { isMod } from "/imports/api/common/persimmons";

Meteor.startup(function () {
	Posts._ensureIndex({
		"owner._id": 1,
		"owner.normalizedUsername": 1,
		name: 1,
		visibility: 1,
		originality: 1
	});
});

function checkState(state) {
	check(state, Match.Optional(
		{
			originalOnly: Boolean,
			tagStr: String,
			filterId: Match.Optional(String)
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

	if (state.filterId) {

	}

	return doc;
}

function filter(state, user, query) {
	const filter = expr(() => {
		if (state.filterId) {
			return Filters.findOne({ _id: state.filterId }, { hides: 1 });
		} else {
			if (user) {
				return user.defaultFilter;
			} return;
		}
	});
	if (filter && filter.hides) {
		query.$nor = [ tagQuery(filter.hides) ];
	}
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
			"owner.normalizedUsername": username.toLowerCase(),
			name: postName
		}
	);
});

Meteor.publish("postColor", function (username, postName) {
	check(username, String);
	check(postName, String);
	// We unfortunately have to publish owner in its entirety (thanks mergebox)
	return Posts.find(
		{
			"owner.normalizedUsername": username.toLowerCase(),
			name: postName
		},
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
					friends: 1,
					defaultFilter: 1,
					blocking: 1
				} });

				return privacyWrap(
					{},
					this.userId,
					user.friends,
					undefined,
					user.blocking
				);
			} else {
				return { visibility: "public" };
			}
		});

		const query = queryBuilder(
			this.userId,
			doc,
			state
		);

		filter(state, user, query);
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
					friends: 1,
					defaultFilter: 1,
					blocking: 1
				} });

				return privacyWrap(
					{ "owner.username": username },
					this.userId,
					user.friends,
					undefined,
					user.blocking
				);
			} else {
				return {
					"owner.username": username,
					visibility: "public"
				};
			}
		});

		const query = queryBuilder(
			this.userId,
			doc,
			state
		);

		filter(state, user, query);
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
				friends: 1,
				defaultFilter: 1,
				blocking: 1
			} });

			const query = queryBuilder(
				this.userId,
				privacyWrap(
					{ $or: [
						{ "owner._id": this.userId },
						{ "owner._id": { $in: user.subscriptions || [] } }
					] },
					this.userId,
					user.friends,
					undefined,
					user.blocking
				),
				state
			);

			filter(state, user, query);
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
					friends: 1,
					defaultFilter: 1,
					blocking: 1
				} });
				return privacyWrap(innerQuery, this.userId, user.friends, undefined, user.blocking);
			} else {
				return privacyWrap(innerQuery);
			}
		});

		const query = queryBuilder(
			this.userId,
			doc,
			state
		);

		filter(state, user, query);
		return Posts.find(query, options(page));
	});
});

Meteor.publish("postAlbum", function (albumData, state, page=0) {
	check(albumData, {
		username: String,
		slug: String
	});
	checkState(state);
	check(page, Number);

	this.autorun(function (computation) {
		const album = Albums.findOne(
			{
				"owner.username": albumData.username,
				slug: albumData.slug
			},
			{ fields: { "owner._id": 1, posts: 1 } }
		);

		if (! album) {
			return;
		}

		const innerQuery = { _id: { $in: album.posts } };

		let user;
		const doc = expr(() => {
			if (this.userId) {
				user = Meteor.users.findOne(this.userId, { fields: {
					friends: 1,
					defaultFilter: 1,
					blocking: 1
				} });
				return privacyWrap(
					innerQuery,
					this.userId,
					user.friends,
					{ "owner._id": album.owner._id },
					user.blocking
				);
			} else {
				return privacyWrap(innerQuery);
			}
		});

		const query = queryBuilder(
			this.userId,
			doc,
			state
		);

		filter(state, user, query);
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
