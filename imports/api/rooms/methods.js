import _ from "lodash";

import Rooms from "/imports/api/rooms/collection";
import Topics from "/imports/api/topics/collection";
import Messages from "/imports/api/messages/collection";
import createSlugCycler from "/imports/api/common/createSlugCycler";
import docBuilder from "/imports/api/common/docBuilder";
import { isMod } from "/imports/api/common/persimmons";
import checkReason from "/imports/api/common/checkReason";
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

function updateCommunity(communityId, data, auth) {
	const room = Rooms.findOne(communityId);

	auth(room);

	Rooms.update(
		{ _id: communityId },
		{ $set: _.defaults({
			updatedAt: new Date()
		}, data) }
	);

	if (Meteor.isServer) {
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
		return slug;
	}
}

function deleteCommunity(communityId, auth) {
	const room = Rooms.findOne(communityId);
	auth(room);
	Rooms.remove(communityId);
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

	joinCommunity(communityId) {
		check(communityId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const community = Rooms.findOne(communityId);

		if (community.requireInvite) {
			throw new Meteor.Error("not-authorized");
		}

		Roles.setUserRoles(Meteor.userId(), [ "member" ], "community_" + community.slug);
	},
	leaveCommunity(communityId) {
		check(communityId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const community = Rooms.findOne(communityId);

		Roles.setUserRoles(Meteor.userId(), [], "community_" + community.slug);
	}
});
