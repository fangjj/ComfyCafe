import React from "react";

import NavItem from "./NavItem";

const TopBarChatButton = React.createClass({
  render() {
    return <NavItem
      iconName="forum"
      href={FlowRouter.path("roomList")}
    />;
  }
});

export default TopBarChatButton;
