import React from "react";

import NavItem from "./NavItem";

const TopBarTagButton = React.createClass({
  render() {
    return <NavItem
      label="Tags"
      iconName="style"
      href={FlowRouter.path("tagList")}
      className="hide-on-small-only"
    />;
  }
});

export default TopBarTagButton;
