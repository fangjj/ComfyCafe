export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const AlbumListContainer = require("../client/components/Album/AlbumListContainer").default;
      return {
        main: <AlbumListContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("albumsBy", params.username);
  }
};
