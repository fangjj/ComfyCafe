import React from "react";

import NavItem from "./NavItem";

const TopBarExploreButton = React.createClass({
  render() {
    return <NavItem
      label="Explore"
      iconName="explore"
      href={FlowRouter.path("explore")}
      className="hide-on-small-only"
    />;
  }
});

export default TopBarExploreButton;
