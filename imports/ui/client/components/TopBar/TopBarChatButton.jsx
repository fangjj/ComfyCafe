import React from "react";

import NavItem from "./NavItem";

export default () => {
  return <NavItem
    iconName="forum"
    href={FlowRouter.path("roomList")}
  />;
};
