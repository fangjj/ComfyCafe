export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const AlbumContainer = require("../client/components/Album/AlbumContainer").default;
      return {
        main: <AlbumContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("album", params.username, params.albumSlug);
  }
};
