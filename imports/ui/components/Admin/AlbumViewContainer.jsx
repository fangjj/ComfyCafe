import { createContainer } from "meteor/react-meteor-data";

import Albums from "/imports/api/albums/collection";
import AlbumView from "./AlbumView";

export default createContainer(({ params }) => {
  const albumId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("modAlbum", albumId);
  return {
    loading: ! handle.ready(),
    album: Albums.findOne({ _id: albumId })
  };
}, AlbumView);
