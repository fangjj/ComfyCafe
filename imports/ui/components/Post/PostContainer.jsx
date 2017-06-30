import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";

import Post from "./Post";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  if (! username) {
    return { loading: true };
  }

  const handle = Meteor.subscribe("post",
    username,
    FlowRouter.getParam("postName"),
  );

  const data = {
    loading: ! handle.ready(),
    post: Posts.findOne(
      {
        "owner.normalizedUsername": username.toLowerCase(),
        name: FlowRouter.getParam("postName")
      }
    )
  };

  return data;
}, Post);
