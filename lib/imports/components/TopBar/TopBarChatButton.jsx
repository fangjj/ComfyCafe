import React from "react";

const TopBarChatButton = React.createClass({
  render() {
    return <NavItem
      iconName="forum"
      href={FlowRouter.path("roomList")}
    />;
  }
});

export default TopBarChatButton;
