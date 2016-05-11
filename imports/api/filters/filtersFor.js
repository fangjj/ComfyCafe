import _ from "lodash";

import Filters from "/imports/api/filters/collection";

function filtersFor() {
  return Filters.find(
    { $or: [
      { "owner._id": Meteor.userId() },
      { _id: { $in: _.get(Meteor.user(), "filters", []) } },
      { owner: { $exists: false } },
    ] }
  );
}

export default filtersFor;
