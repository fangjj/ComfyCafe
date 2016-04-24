import { createContainer } from "meteor/react-meteor-data";

import Pages from "/imports/api/pages/collection";
import PageList from "./PageList";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("pagesBy", FlowRouter.getParam("username"));

  return {
    loading: ! handle.ready(),
    pages: Pages.find(
      { "owner.username": FlowRouter.getParam("username") },
      { sort: { createdAt: -1, name: 1 } }
    ).fetch(),
    currentUser: Meteor.user()
  };
}, PageList);
