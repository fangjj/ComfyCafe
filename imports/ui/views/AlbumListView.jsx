export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const AlbumListContainer = require("../client/components/Album/AlbumListContainer").default;
      return {
        layout: MainLayout,
        content: {
          main: <AlbumListContainer />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("albumsBy", params.username);
  }
};
