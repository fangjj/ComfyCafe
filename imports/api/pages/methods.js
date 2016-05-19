import _ from "lodash";

import Pages from "/imports/api/pages/collection";
import "/imports/api/topics/methods";
import Topics from "/imports/api/topics/collection";
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

function updatePage(pageId, data, auth) {
  const page = Pages.findOne(pageId);

  auth(page);

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
}

function deletePage(pageId, auth) {
  const page = Pages.findOne(pageId);

  auth(page);

  Pages.remove(pageId);
  Topics.remove({ _id: page.topic._id });
  Meteor.users.update(
    { _id: Meteor.userId() },
    { $inc: { "profile.pageCount": -1 } }
  );

  return page;
}

Meteor.methods({
	addPage(data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		let topicId;
		if (Meteor.isServer) {
			topicId = Meteor.call("addTopic", Meteor.user().room._id, { name: data.name }, true);
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

		return updatePage(pageId, data, (page) => {
    		if (! isOwner(page)) {
    			throw new Meteor.Error("not-authorized");
    		}
      }
    );
	},
  modUpdatePage(pageId, data, reason) {
		check(pageId, String);
		check(data, match);
		checkReason(reason);

		let owner;
		const slug = updatePage(pageId, data, (page) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}

			owner = page.owner;
		});

		const doc = docBuilder({
			item: {
				_id: pageId,
				ownerId: owner._id,
				type: "page",
				action: "updated",
				url: FlowRouter.path("page", {
					username: owner.username,
					slug
				})
			}
		}, reason);
		ModLog.insert(doc);
	},
	deletePage(pageId) {
		check(pageId, String);
    deletePage(pageId, (page) => {
      if (! isOwner(page)) {
        throw new Meteor.Error("not-authorized");
      }
    });
	},
  modDeletePage(pageId, reason) {
		check(pageId, String);
		checkReason(reason);

		const page = deletePage(pageId, (page) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}
		});

		const doc = docBuilder({
			item: {
				_id: pageId,
				ownerId: page.owner._id,
				type: "page",
				action: "deleted"
			}
		}, reason);
		ModLog.insert(doc);
	}
});
