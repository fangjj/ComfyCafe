import React from "react";
import { mount } from "react-mounter";

import LayoutContainer from "/imports/ui/components/LayoutContainer";

function render(props) {
  if (Meteor.isClient) {
    Session.set("previousPath", Session.get("currentPath") || "/");
    Session.set("currentPath", FlowRouter.current().path);
  } else {
    global.navigator = {
      userAgent: FlowRouter.current()._serverRequest.headers["user-agent"] || "all"
    };
  }
  mount(LayoutContainer, props);
};

export default render;
