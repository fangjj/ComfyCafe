import React from "react";

import ModLogItem from "/imports/ui/client/components/ModLog/ModLogItem";

export default (props) => {
  props.report.item.action = "reported";
  props.report.item.url = FlowRouter.path("adminView", {
    panel: "reports",
    id: props.report._id
  });
  return <ModLogItem ml={props.report} />;
};
