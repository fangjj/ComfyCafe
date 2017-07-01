import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";

import Post from "./Post";

export default createContainer(({ params }) => {
  const name = FlowRouter.getParam("name");
  const handle = Meteor.subscribe("post", name);

  const data = {
    loading: ! handle.ready(),
    post: Posts.findOne({ name })
  };

  return data;
}, Post);
