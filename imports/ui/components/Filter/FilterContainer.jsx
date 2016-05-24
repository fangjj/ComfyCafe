import { createContainer } from "meteor/react-meteor-data";

import Filters from "/imports/api/filters/collection";
import Filter from "./Filter";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  const slug = FlowRouter.getParam("slug");
  const handle = Meteor.subscribe("filterSlug", username, slug);
  return {
    loading: ! handle.ready(),
    filter: Filters.findOne(
      {
        "owner.username": username,
        slug
      }
    )
  };
}, Filter);
