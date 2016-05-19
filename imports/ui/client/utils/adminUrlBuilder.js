const panelMap = {
  post: "images"
};

function adminUrlBuilder(item) {
  return FlowRouter.path("adminView", {
    panel: panelMap[item.type],
    id: item._id
  });
}

export default adminUrlBuilder;
