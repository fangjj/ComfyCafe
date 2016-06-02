import { createContainer } from "meteor/react-meteor-data";

import Pages from "/imports/api/pages/collection";
import Page from "./Page";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  const slug = FlowRouter.getParam("slug");
  const handle = Meteor.subscribe("page", username, slug);

  return {
    loading: ! handle.ready(),
    page: Pages.findOne(
      {
        "owner.username": username,
        slug: slug
      }
    ),
    currentUser: Meteor.user()
  };
}, Page);
