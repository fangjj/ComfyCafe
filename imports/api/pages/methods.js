import _ from "lodash";

import Pages from "/imports/api/pages/collection";
import "/imports/api/topics/methods";
import Topics from "/imports/api/topics/collection";
import Notifications from "/imports/api/notifications/collection";
import processMentions from "/imports/api/common/processMentions";
import createSlugCycler from "/imports/api/common/createSlugCycler";

const match = {
  name: String,
	visibility: String,
	body: String
};

const slugCycle = createSlugCycler(Pages);

function mentions(pageId, data) {
  if (Meteor.isServer) {
    processMentions("page", data.body, {
      page: {
        _id: pageId,
        name: data.name
      }
    });
  }
}

Meteor.methods({
	addPage(data) {
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

    const slug = slugCycle(null, data.name);

		const pageId = Pages.insert(_.defaults({
      createdAt: new Date(),
			updatedAt: new Date(),
      slug: slug,
      owner: {
				_id: Meteor.userId(),
				username: Meteor.user().username,
				profile: Meteor.user().profile
			},
			topic: {
				_id: topicId
			}
    }, data));

		mentions(pageId, data);
	},
	updatePage(pageId, data) {
		check(pageId, String);
		check(data, match);

		const page = Pages.findOne(pageId);

		if (! isOwner(page)) {
			throw new Meteor.Error("not-authorized");
		}

    const slug = slugCycle(pageId, data.name);

		Pages.update(
			{ _id: pageId },
			{ $set: _.defaults({
        updatedAt: new Date(),
        slug: slug
      }, data) }
		);

		Topics.update(
			{ _id: page.topic._id },
			{ $set: {
				visibility: data.visibility
			} }
		);

		mentions(pageId, data);
	},
	deletePage(pageId) {
		check(pageId, String);

		const page = Pages.findOne(pageId);

		if (! isOwner(page)) {
			throw new Meteor.Error("not-authorized");
		}

		Pages.remove(pageId);
		Topics.remove({ _id: page.topic._id });
	}
});
