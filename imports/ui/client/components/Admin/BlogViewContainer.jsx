import { createContainer } from "meteor/react-meteor-data";

import BlogPosts from "/imports/api/blog/collection";
import BlogView from "./BlogView";

export default createContainer(({ params }) => {
  const blogId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("modBlogPost", blogId);
  return {
    loading: ! handle.ready(),
    blog: BlogPosts.findOne({ _id: blogId })
  };
}, BlogView);
