import React from "react";

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
