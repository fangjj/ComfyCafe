import _ from "lodash";

import Pages from "/imports/api/pages/collection";
import "/imports/api/topics/methods";
import Topics from "/imports/api/topics/collection";
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
        slug: data.slug,
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
			}, true);
		}

    data.slug = slugCycle(null, data.name);

		const pageId = Pages.insert(_.defaults({
      createdAt: new Date(),
			updatedAt: new Date(),
      owner: {
				_id: Meteor.userId(),
				username: Meteor.user().username,
				normalizedUsername: Meteor.user().normalizedUsername,
				profile: Meteor.user().profile
			},
			topic: {
				_id: topicId
			}
    }, data));

    Meteor.users.update(
      { _id: Meteor.userId() },
      { $inc: { "profile.pageCount": 1 } }
    );

		mentions(pageId, data);

    return data.slug;
	},
	updatePage(pageId, data) {
		check(pageId, String);
		check(data, match);

		const page = Pages.findOne(pageId);

		if (! isOwner(page)) {
			throw new Meteor.Error("not-authorized");
		}

		Pages.update(
			{ _id: pageId },
			{ $set: _.defaults({
        updatedAt: new Date()
      }, data) }
		);

		Topics.update(
			{ _id: page.topic._id },
			{ $set: {
        name: data.name,
				visibility: data.visibility
			} }
		);

		mentions(pageId, data);

    if (Meteor.isServer) {
      const slug = slugCycle(pageId, data.name);
      Pages.update(
        { _id: pageId },
        { $set: { slug } }
      );
      return slug;
    }
	},
	deletePage(pageId) {
		check(pageId, String);

		const page = Pages.findOne(pageId);

		if (! isOwner(page)) {
			throw new Meteor.Error("not-authorized");
		}

		Pages.remove(pageId);
		Topics.remove({ _id: page.topic._id });
    Meteor.users.update(
      { _id: Meteor.userId() },
      { $inc: { "profile.pageCount": -1 } }
    );
	}
});
