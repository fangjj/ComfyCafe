import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";

import Post from "./Post";

export default createContainer(({ params }) => {
  const id = FlowRouter.getParam("postId");
  let handle;
  let doc = {};

  if (id) {
    console.error("postPerma was triggered, which shouldn't actually happen.");
    handle = Meteor.subscribe("postPerma", id);
    doc = { _id: id };
  } else {
    handle = Meteor.subscribe("post",
      FlowRouter.getParam("username"),
      FlowRouter.getParam("postName"),
    );
    doc = {
      "owner.username": FlowRouter.getParam("username"),
      name: FlowRouter.getParam("postName")
    };
  }

  return {
    loading: ! handle.ready(),
    post: Posts.findOne(doc),
    currentUser: Meteor.user()
  };
}, Post);
