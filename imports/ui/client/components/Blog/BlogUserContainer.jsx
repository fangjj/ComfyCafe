import { createContainer } from "meteor/react-meteor-data";

import BlogPosts from "/imports/api/blog/collection";
import BlogList from "./BlogList";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  const handle = Meteor.subscribe("blogBy", username);
  return {
    loading: ! handle.ready(),
    posts: BlogPosts.find(
      { "owner.username": username },
      { sort: { createdAt: -1, name: 1 } }
    ).fetch(),
    hideFab: ! Boolean(Meteor.user()) || Meteor.user().username !== username
  };
}, BlogList);
