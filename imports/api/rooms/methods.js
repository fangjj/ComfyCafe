import _ from "lodash";

import Rooms from "/imports/api/rooms/collection";
import Invites from "/imports/api/invites/collection";
import Topics from "/imports/api/topics/collection";
import Messages from "/imports/api/messages/collection";
import Notifications from "/imports/api/notifications/collection";
import createSlugCycler from "/imports/api/common/createSlugCycler";
import docBuilder from "/imports/api/common/docBuilder";
import { isAdmin, isMod, isPriveleged, isMember } from "/imports/api/common/persimmons";
import checkReason from "/imports/api/common/checkReason";
import Reports from "/imports/api/reports/collection";
import ModLog from "/imports/api/modlog/collection";

const match = {
	name: String,
	description: String,
	rules: String,

	requireInvite: Boolean,
	membersCanInvite: Boolean,
	moderatorsCanInvite: Boolean,
	adminsCanInvite: Boolean,
	membersOnlyView: Boolean,
	membersOnlyPost: Boolean,
	membersOnlyCreate: Boolean
};

const slugCycle = createSlugCycler(Rooms, true);

function getInvite(userId, community) {
	return Invites.findOne(
		{
			to: userId,
			"community._id": community._id
		}
	);
}

function consumeInvite(userId, community) {
	Invites.remove(
		{
			to: userId,
			"community._id": community._id
		}
	);
}

function updateCommunity(communityId, data, auth) {
	const room = Rooms.findOne(communityId);

	auth(room);

	Rooms.update(
		{ _id: communityId },
		{ $set: _.defaults({
			updatedAt: new Date()
		}, data) }
	);

	if (Meteor.isServer && data.name !== room.name) {
		const slug = slugCycle(communityId, data.name);
		Rooms.update(
			{ _id: communityId },
			{ $set: { slug } }
		);
		Topics.update(
			{ "room._id": communityId },
			{ $set: {
				"room.name": data.name,
				"room.slug": slug
			} },
			{ multi: true }
		);
		Messages.update(
			{ "topic.room._id": communityId },
			{ $set: {
				"topic.room.name": data.name,
				"topic.room.slug": slug
			} },
			{ multi: true }
		);
		Reports.update(
			{ "community._id": communityId },
			{ $set: {
				"community.slug": slug
			} },
			{ multi: true }
		);
		ModLog.update(
			{ "community._id": communityId },
			{ $set: {
				"community.slug": slug
			} },
			{ multi: true }
		);

		const fdoc = {};
		fdoc["roles.community_" + room.slug] = { $exists: true };
		Meteor.users.find(fdoc).map((user) => {
			const udoc = { $unset: {}, $set: {} };
			udoc.$unset["roles.community_" + room.slug] = 1;
			udoc.$set["roles.community_" + slug] = user.roles["community_" + room.slug];
			Meteor.users.update({ _id: user._id }, udoc);
		});

		return slug;
	}
}

function deleteCommunity(communityId, auth) {
	const room = Rooms.findOne(communityId);
	auth(room);
	Rooms.remove(communityId);
	Topics.remove({ "room._id": communityId });
	Messages.remove({ "topic.room._id": communityId });
	Reports.remove({ "community._id": communityId });
	ModLog.remove({ "community._id": communityId });

	const fdoc = {};
	fdoc["roles.community_" + room.slug] = { $exists: true };
	const udoc = { $unset: {} };
	udoc.$unset["roles.community_" + room.slug] = 1;
	Meteor.users.update(fdoc, udoc, { multi: true });

	return room;
}

Meteor.methods({
	addRoom(data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		data.slug = slugCycle(null, data.name);

		const doc = docBuilder({
			lastActivity: new Date(),
			topicCount: 0,
			members: [ Meteor.userId() ]
		}, data);
		const roomId = Rooms.insert(doc);

		Roles.setUserRoles(
			Meteor.userId(),
			[ "admin", "moderator", "member" ],
			"community_" + data.slug
		);

		return data.slug;
	},
	updateRoom(roomId, data) {
		check(roomId, String);
		check(data, match);
		return updateCommunity(roomId, data, (room) => {
			if (! isOwner(room)) {
				throw new Meteor.Error("not-authorized");
			}
		});
	},
	modUpdateCommunity(communityId, data, reason) {
		check(communityId, String);
		check(data, match);
		checkReason(reason);

		let owner;
		const slug = updateCommunity(communityId, data, (community) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}

			owner = community.owner;
		});

		const doc = docBuilder({
			item: {
				_id: communityId,
				ownerId: owner._id,
				type: "community",
				action: "updated",
				url: FlowRouter.path("room", { roomSlug: slug })
			}
		}, reason);
		ModLog.insert(doc);
	},
	deleteRoom(roomId) {
		check(roomId, String);
		deleteCommunity(roomId, (room) => {
			if (! isOwner(room)) {
				throw new Meteor.Error("not-authorized");
			}
		});
	},
	modDeleteCommunity(communityId, reason) {
		check(communityId, String);
		checkReason(reason);

		const community = deleteCommunity(communityId, (community) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}
		});

		const doc = docBuilder({
			item: {
				_id: communityId,
				ownerId: community.owner._id,
				type: "community",
				action: "deleted"
			}
		}, reason);
		ModLog.insert(doc);
	},

	inviteUsers(communityId, userList) {
		check(communityId, String);
		check(userList, [String]);

		const community = Rooms.findOne(communityId);

		const group = "community_" + community.slug;
		if (! (
			(community.membersCanInvite && isMember(Meteor.userId(), group))
			|| (community.moderatorsCanInvite && isMod(Meteor.userId(), group))
			|| (community.adminsCanInvite && isAdmin(Meteor.userId(), group))
		)) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.find({ username: { $in: userList } }).map((user) => {
			const invite = getInvite(user._id, community);
			if (! invite && ! isMember(user._id, "community_" + community.slug)) {
				const doc = docBuilder({
					community: _.pick(community, [ "_id", "slug" ]),
					to: user._id
				});
				Invites.insert(doc);

				// notify recipient: "x invited you to y!"
				Notifications.insert(docBuilder(
					{
						to: user._id,
						action: "invited",
						room: {
							_id: communityId,
							name: community.name,
							slug: community.slug
						}
					}
				));
			}
		});
	},
	joinCommunity(communityId) {
		check(communityId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const community = Rooms.findOne(communityId);

		const invite = getInvite(Meteor.userId(), community);

		if (community.requireInvite && ! invite) {
			throw new Meteor.Error("not-authorized");
		}

		consumeInvite(Meteor.userId(), community);

		Rooms.update(
			{ _id: communityId },
			{ $addToSet: { members: Meteor.userId() } }
		);
		Roles.setUserRoles(Meteor.userId(), [ "member" ], "community_" + community.slug);

		// notify group owner: "x joined y!"
		Notifications.insert(docBuilder(
			{
				to: community.owner._id,
				action: "joined",
				room: {
					_id: communityId,
					name: community.name,
					slug: community.slug
				}
			}
		));
		// notify inviter, if applicable "x accepted your invite to y!"
		Notifications.insert(docBuilder(
			{
				to: invite.owner._id,
				action: "inviteAccepted",
				room: {
					_id: communityId,
					name: community.name,
					slug: community.slug
				}
			}
		));
	},
	leaveCommunity(communityId) {
		check(communityId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const community = Rooms.findOne(communityId);

		Rooms.update(
			{ _id: communityId },
			{ $pull: { members: Meteor.userId() } }
		);
		Roles.setUserRoles(Meteor.userId(), [], "community_" + community.slug);
	},
	kickUser(slug, userId) {
		check(slug, String);
		check(userId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const group = "community_" + slug;

		if (! isMod(Meteor.userId(), group)) {
			throw new Meteor.Error("not-authorized");
		}

		if (isPriveleged(userId, group)) {
			throw new Meteor.Error("not-authorized");
		}

		Rooms.update(
			{ _id: communityId },
			{ $pull: { members: Meteor.userId() } }
		);
		Roles.setUserRoles(userId, [], group);
	}
});
