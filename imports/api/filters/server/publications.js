import _ from "lodash";

import Filters from "/imports/api/filters/collection";

Meteor.publish("globalFilters", function () {
	return Filters.find({ owner: { $exists: false } });
});

Meteor.publish("filter", function (filterId) {
	check(filterId, String);
	return Filters.find({ _id: filterId });
});

Meteor.publish("filterSlug", function (username, slug) {
	check(username, String);
	check(slug, String);
	return Filters.find(
		{
			"owner.username": username,
			slug
		}
	);
});

Meteor.publish("filtersBy", function (username) {
	check(username, String);
	return Filters.find({ "owner.username": username });
});

Meteor.publish("filtersFor", function () {
	this.autorun(function (computation) {
		let userFilters = [];
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				filter: 1
			} });
			userFilters = user.filters || [];
		}

		return Filters.find(
			{ $or: [
				{ "owner._id": this.userId },
				{ _id: { $in: userFilters } },
				{ owner: { $exists: false } },
			] }
		);
	});
});

Meteor.publish("defaultFilter", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				"settings.defaultFilter": 1
			} });
			const defaultFilter = _.get(user, "settings.defaultFilter");
			if (defaultFilter) {
				return Filters.find({ _id: defaultFilter });
			}
		}

		return Filters.find(
			{
				owner: { $exists: false },
				default: true
			}
		);
	});
});
