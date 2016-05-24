import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Filters from "/imports/api/filters/collection";
import FilterView from "./FilterView";

export default createContainer(({ params }) => {
  const filterId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("filter", filterId);
  return {
    loading: ! handle.ready(),
    filter: Filters.findOne({ _id: filterId })
  };
}, FilterView);
