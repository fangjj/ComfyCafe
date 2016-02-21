TopBarChatButton = React.createClass({
  render() {
    return <NavItem
      iconName="forum"
      href={FlowRouter.path("roomList")}
    />;
  }
});
