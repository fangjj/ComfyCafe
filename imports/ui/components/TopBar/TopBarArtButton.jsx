import React from "react";

import NavItem from "./NavItem";

const TopBarArtButton = () => {
  return <NavItem
    label="Images"
    iconName="image"
    href={FlowRouter.path("art")}
    className="hide-on-small-only"
  />;
};

export default TopBarArtButton;
