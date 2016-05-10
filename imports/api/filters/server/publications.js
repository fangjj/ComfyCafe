import _ from "lodash";

import Filters from "/imports/api/filters/collection";

Meteor.publish("globalFilters", function () {
	return Filters.find({ owner: { $exists: false } });
});

Meteor.publish("filter", function (filterId) {
	check(filterId, String);
	return Filters.find({ _id: filterId });
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
