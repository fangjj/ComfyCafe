import Filters from "/imports/api/filters/collection";

Meteor.publish("globalFilters", function () {
	return Filters.find({ owner: { $exists: false } });
});
