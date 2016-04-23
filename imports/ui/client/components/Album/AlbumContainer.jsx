import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Albums from "/imports/api/albums/collection";
import Posts from "/imports/api/posts/collection";
import Album from "./Album";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  const slug = FlowRouter.getParam("albumSlug");
  const handle = Meteor.subscribe("album", username, slug);
  const postsHandle = Meteor.subscribe("albumPosts", username, slug);

  const album = Albums.findOne(
    {
      "owner.username": username,
      slug: slug
    }
  );

  return {
    loading: ! handle.ready(),
    postsLoading: ! postsHandle.ready(),
    album,
    posts: Posts.find({ _id: { $in: _.get(album, "posts", []) } }).fetch(),
    currentUser: Meteor.user()
  };
}, Album);
