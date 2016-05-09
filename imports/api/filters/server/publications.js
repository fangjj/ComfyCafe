import Filters from "/imports/api/filters/collection";

Meteor.publish("globalFilters", function () {
	return Filters.find({ owner: { $exists: false } });
});

Meteor.publish("filter", function (filterId) {
	check(filterId, String);
	return Filters.find({ _id: filterId });
});
