import React from "react";

import NavItem from "./NavItem";

export default () => {
  return <NavItem
    label="Images"
    iconName="image"
    href={FlowRouter.path("home")}
    className="hide-on-small-only"
  />;
};
