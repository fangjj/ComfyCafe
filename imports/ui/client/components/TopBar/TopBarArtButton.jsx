import React from "react";

import NavItem from "./NavItem";

export default () => {
  return <NavItem
    label="Images"
    iconName="image"
    href={FlowRouter.path("art")}
    className="hide-on-small-only"
  />;
};
