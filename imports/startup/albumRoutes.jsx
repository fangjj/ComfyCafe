import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/api/common/setTitle";

import AlbumListContainer from "/imports/ui/components/Album/AlbumListContainer";
import AlbumContainer from "/imports/ui/components/Album/AlbumContainer";

const albumRoutes = FlowRouter.group({ prefix: "/a" });

albumRoutes.route("/:username", {
  name: "albumsBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Albums");
    render({ main: <AlbumListContainer /> });
  }
});

albumRoutes.route("/:username/:albumSlug", {
  name: "album",
  action: function () {
    setTitle(FlowRouter.getParam("albumSlug"));
    render({ main: <AlbumContainer /> });
  }
});
