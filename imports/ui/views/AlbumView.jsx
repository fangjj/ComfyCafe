export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const AlbumContainer = require("../client/components/Album/AlbumContainer").default;
      return {
        layout: MainLayout,
        content: {
          main: <AlbumContainer />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("album", params.username, params.albumName);
  }
};
