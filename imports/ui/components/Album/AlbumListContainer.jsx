import { createContainer } from "meteor/react-meteor-data";

import Albums from "/imports/api/albums/collection";
import AlbumList from "./AlbumList";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("albumsBy", FlowRouter.getParam("username"));

  return {
    loading: ! handle.ready(),
    albums: Albums.find(
      { "owner.username": FlowRouter.getParam("username") },
      { sort: { createdAt: -1, name: 1 } }
    ).fetch(),
    currentUser: Meteor.user()
  };
}, AlbumList);
