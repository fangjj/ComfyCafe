import React from "react";

import NavItem from "./NavItem";

export default () => {
  return <NavItem
    label="Tags"
    iconName="style"
    href={FlowRouter.path("tagList")}
    className="hide-on-small-only"
  />;
};
