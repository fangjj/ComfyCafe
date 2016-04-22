import { createContainer } from "meteor/react-meteor-data";

import Albums from "/imports/api/albums/collection";
import Album from "./Album";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("album",
    FlowRouter.getParam("username"),
    FlowRouter.getParam("albumName"),
  );

  return {
    loading: ! handle.ready(),
    album: Albums.findOne(
      {
        "owner.username": FlowRouter.getParam("username"),
        name: FlowRouter.getParam("albumName")
      }
    ),
    currentUser: Meteor.user()
  };
}, Album);
