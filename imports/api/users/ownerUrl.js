function ownerUrl(owner) {
  return FlowRouter.path("profile", { username: owner.username });
}

export default ownerUrl;
