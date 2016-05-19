import React from "react";
import IconButton from "material-ui/IconButton";

import ModLogItem from "/imports/ui/client/components/ModLog/ModLogItem";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default (props) => {
  props.report.item.action = "reported";
  props.report.item.url = FlowRouter.path("adminView", {
    panel: "reports",
    id: props.report._id
  });
  return <ModLogItem ml={props.report}>
    <div className="delete">
      <IconButton onTouchTap={() => Meteor.call("modDeleteReport", props.report._id)}>
        <Icon>close</Icon>
      </IconButton>
    </div>
  </ModLogItem>;
};
