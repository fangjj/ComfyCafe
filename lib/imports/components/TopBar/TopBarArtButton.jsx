import React from "react";

const TopBarArtButton = React.createClass({
  render() {
    return <NavItem
      label="Images"
      iconName="image"
      href={FlowRouter.path("art")}
      className="hide-on-small-only"
    />;
  }
});

export default TopBarArtButton;
