const panelMap = {
  user: "users",
  image: "images",
  message: "messages"
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
