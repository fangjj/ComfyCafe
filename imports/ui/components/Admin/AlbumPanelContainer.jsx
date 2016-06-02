import { createContainer } from "meteor/react-meteor-data";

import Albums from "/imports/api/albums/collection";
import AlbumPanel from "./AlbumPanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modAllAlbums");
  return {
    loading: ! handle.ready(),
    albums: Albums.find(
      {},
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, AlbumPanel);
