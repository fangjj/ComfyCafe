import React from "react";

import NavItem from "./NavItem";

export default () => {
  return <NavItem
    label="Dank"
    iconName="local_pizza"
    href={FlowRouter.path("dank")}
    className="hide-on-small-only"
  />;
};
