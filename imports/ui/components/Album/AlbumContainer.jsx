import { createContainer } from "meteor/react-meteor-data";

import Albums from "/imports/api/albums/collection";
import Album from "./Album";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  const slug = FlowRouter.getParam("albumSlug");
  const handle = Meteor.subscribe("album", username, slug);

  const album = Albums.findOne(
    {
      "owner.username": username,
      slug
    }
  );

  return {
    loading: ! handle.ready(),
    album,
    currentUser: Meteor.user()
  };
}, Album);
