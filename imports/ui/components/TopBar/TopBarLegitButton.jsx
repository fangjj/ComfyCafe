import React from "react";

import NavItem from "./NavItem";

export default () => {
  return <NavItem
    label="Legit"
    iconName="work"
    href={FlowRouter.path("legit")}
    className="hide-on-small-only"
  />;
};
