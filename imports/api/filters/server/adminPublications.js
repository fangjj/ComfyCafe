import Filters from "/imports/api/filters/collection";
import adminPublication from "/imports/api/common/server/adminPublication";

Meteor.publish("adminAllFilters", adminPublication(function () {
  return Filters.find({ owner: { $exists: true } });
}));
