import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import AlbumView from "/imports/ui/views/AlbumView";
import AlbumListView from "/imports/ui/views/AlbumListView";

const albumRoutes = FlowRouter.group({ prefix: "/a" });

albumRoutes.route("/:username", {
  name: "albumsBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Albums");
    renderView(AlbumListView);
  }
});

albumRoutes.route("/:username/:albumSlug", {
  name: "album",
  action: function () {
    setTitle(FlowRouter.getParam("albumSlug"));
    renderView(AlbumView);
  }
});
