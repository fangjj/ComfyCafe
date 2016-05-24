import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";
import ImagePanel from "./ImagePanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modAllPosts");
  return {
    loading: ! handle.ready(),
    images: Posts.find(
      {},
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, ImagePanel);
