import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Filters from "/imports/api/filters/collection";
import FilterPanel from "./FilterPanel";

export default createContainer(({ params }) => {
  const globalHandle = Meteor.subscribe("globalFilters");
  const handle = Meteor.subscribe("adminAllFilters", Meteor.userId());
  return {
    globalLoading: ! globalHandle.ready(),
    loading: ! handle.ready(),
    globalFilters: Filters.find({ owner: { $exists: false } }).fetch(),
    filters: Filters.find({ owner: { $exists: true } }).fetch()
  };
}, FilterPanel);
