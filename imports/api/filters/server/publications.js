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
				defaultFilter: 1
			} });
			if (user.defaultFilter) {
				return Filters.find({ _id: user.defaultFilter });
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
