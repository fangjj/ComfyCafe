PostBrowseUser = React.createClass({
  render() {
    return <PostGallery
      subName="artBy"
      subData={FlowRouter.getParam("username")}
      fabCond={function () {
        return this.data.currentUser.username === FlowRouter.getParam("username");
      }}
      generateDoc={function () {
        return { "owner.username": FlowRouter.getParam("username") };
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          {FlowRouter.getParam("username") + " hasn't uploaded anything yet!"}
        </InlineUhoh>;
      }}
    />;
  }
});
