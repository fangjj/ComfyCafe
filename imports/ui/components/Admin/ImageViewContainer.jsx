import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";
import ImageView from "./ImageView";

export default createContainer(({ params }) => {
  const postId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("modPost", postId);
  return {
    loading: ! handle.ready(),
    image: Posts.findOne({ _id: postId })
  };
}, ImageView);
