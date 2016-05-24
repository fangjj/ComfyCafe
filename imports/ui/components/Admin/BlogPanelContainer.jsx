import { createContainer } from "meteor/react-meteor-data";

import BlogPosts from "/imports/api/blog/collection";
import BlogPanel from "./BlogPanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modAllBlogPosts");
  return {
    loading: ! handle.ready(),
    blogPosts: BlogPosts.find(
      {},
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, BlogPanel);
