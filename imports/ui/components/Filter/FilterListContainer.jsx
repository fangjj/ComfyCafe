import { createContainer } from "meteor/react-meteor-data";

import Filters from "/imports/api/filters/collection";
import FilterList from "./FilterList";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("filtersBy", FlowRouter.getParam("username"));
  return {
    loading: ! handle.ready(),
    filters: Filters.find(
      { "owner.username": FlowRouter.getParam("username") },
      { sort: { createdAt: -1, name: 1 } }
    ).fetch(),
    favoriteFilters: Filters.find(
      { xxx: "yyy" },
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, FilterList);
