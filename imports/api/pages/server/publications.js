import Pages from "/imports/api/pages/collection";
import privacyWrap from "/imports/api/common/privacyWrap";
import { isMod } from "/imports/api/common/persimmons";

Meteor.publish("page", function (username, slug) {
	check(username, String);
	check(slug, String);
	return Pages.find(
		{
			"owner.username": username,
			slug: slug
		}
	);
});

Meteor.publish("pagesBy", function (username) {
	check(username, String);
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Pages.find(
				privacyWrap(
					{ "owner.username": username },
					this.userId,
					user.friends
				)
			);
		} else {
			return Pages.find(
				{
					"owner.username": username,
					visibility: "public"
				}
			);
		}
	});
});

Meteor.publish("modAllPages", function () {
	if (isMod(this.userId)) {
  	return Pages.find({});
	}
});

Meteor.publish("modPage", function (pageId) {
  check(pageId, String);
	if (isMod(this.userId)) {
		return Pages.find({ _id: pageId });
	}
});
