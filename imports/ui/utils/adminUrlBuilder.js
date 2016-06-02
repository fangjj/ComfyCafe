const panelMap = {
  user: "users",
  image: "images",
  blog: "blog",
  page: "pages",
  album: "albums",
  community: "communities",
  topic: "topics",
  message: "messages",
  tag: "tags",
  filter: "filters"
};

function adminUrlBuilder(item, community) {
  if (! community) {
    return FlowRouter.path("adminView", {
      panel: panelMap[item.type],
      id: item._id
    });
  } else {
    return FlowRouter.path("communityAdminView", {
      roomSlug: community,
      panel: panelMap[item.type],
      id: item._id
    });
  }
}

export default adminUrlBuilder;
