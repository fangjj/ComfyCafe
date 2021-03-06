import React from "react";

import NavItem from "./NavItem";

export default () => {
  return <NavItem
    label="Explore"
    iconName="explore"
    href={FlowRouter.path("explore")}
    className="hide-on-small-only"
  />;
};
